import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MessageCircle,
    RefreshCw,
    User,
    Search,
    ArrowLeft,
    Image as ImageIcon,
    Mail,
    Calendar,
    X,
    Download,
    ZoomIn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface SupportTicket {
    id: string;
    ticket_number: string;
    customer_id: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    category: 'order_issues' | 'food_quality' | 'delivery_issues' | 'payment_issues' | 'account_issues' | 'other';
    attached_image?: string;
    attached_images?: string[];
    created_at: string;
    updated_at: string;
    last_message?: string;
    last_message_time?: string;
    unread_count?: number;
    last_activity?: string;
}

interface SupportMessage {
    id: string;
    ticket_id: string;
    sender_type: 'customer' | 'admin';
    sender_id: string;
    message: string;
    created_at: string;
}

const SupportInbox: React.FC = () => {
    // States
    const [currentView, setCurrentView] = useState<'inbox' | 'conversation'>('inbox');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated_at');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { admin } = useAuth();

    const categoryOptions = [
        { value: 'order_issues', label: 'Order Issues', color: 'bg-red-100 text-red-800', icon: '🛒' },
        { value: 'food_quality', label: 'Food Quality', color: 'bg-orange-100 text-orange-800', icon: '🍕' },
        { value: 'delivery_issues', label: 'Delivery Issues', color: 'bg-blue-100 text-blue-800', icon: '🚚' },
        { value: 'payment_issues', label: 'Payment Issues', color: 'bg-purple-100 text-purple-800', icon: '💳' },
        { value: 'account_issues', label: 'Account Issues', color: 'bg-green-100 text-green-800', icon: '👤' },
        { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800', icon: '❓' }
    ];

    // Load all tickets with customer info
    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await api.getSupportTickets({
                status: statusFilter !== 'all' ? statusFilter : undefined,
            });
            const ticketList = (response as any).tickets || response.data || [];
            const mappedTickets: SupportTicket[] = ticketList.map((t: any) => ({
                id: t.id,
                ticket_number: t.ticket_number || t.id?.slice(0, 8),
                customer_id: t.customer_id,
                customer_name: t.customer?.name || 'Customer',
                customer_email: t.customer?.email,
                customer_phone: t.customer?.phone,
                subject: t.subject,
                description: t.description,
                status: t.status || 'open',
                category: t.category || 'other',
                created_at: t.created_at,
                updated_at: t.updated_at || t.created_at,
                last_message: t.description,
                last_message_time: t.updated_at || t.created_at,
                unread_count: 0,
                last_activity: t.status,
            }));
            setTickets(mappedTickets);
        } catch (error) {
            console.error('Error loading tickets:', error);
            toast({
                title: "Error",
                description: "Failed to load support tickets.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Load messages for selected ticket
    const loadMessages = async (ticketId: string) => {
        try {
            const response = await api.getSupportTicket(ticketId);
            const ticket = (response as any).ticket || response.data;
            const msgList = ticket?.messages || (response as any).messages || [];
            const mappedMsgs: SupportMessage[] = msgList.map((m: any) => ({
                id: m.id,
                ticket_id: ticketId,
                sender_type: m.sender_type === 'admin' ? 'admin' : 'customer',
                sender_id: m.sender_id,
                message: m.message,
                created_at: m.created_at,
            }));
            setMessages(mappedMsgs);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return;

        if (!admin?.id) {
            toast({ title: "Error", description: "Admin session not found", variant: "destructive" });
            return;
        }

        setSendingMessage(true);
        try {
            await api.sendSupportMessage(
                selectedTicket.id,
                newMessage.trim(),
                admin.id,
                'admin'
            );

            setNewMessage('');
            await loadMessages(selectedTicket.id);
            await loadTickets();

            if (selectedTicket.status === 'open') {
                setSelectedTicket(prev => prev ? { ...prev, status: 'in_progress' } : null);
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: `Failed to send message`,
                variant: "destructive",
            });
        } finally {
            setSendingMessage(false);
        }
    };

    // Update ticket status
    const updateTicketStatus = async (ticketId: string, status: string) => {
        try {
            const response = await api.updateTicketStatus(ticketId, status);
            if (!(response as any).success) {
                throw new Error((response as any).message || 'Update failed');
            }

            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as any } : t));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => prev ? { ...prev, status: status as any } : null);
            }

            toast({
                title: "Success",
                description: `Ticket status updated to ${status.replace('_', ' ')}.`,
            });
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update ticket status.",
                variant: "destructive",
            });
        }
    };

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        // Mock data usually doesn't have categories set diversely, so we might want to relax category filter or random assign in mock map
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load tickets on mount
    useEffect(() => {
        loadTickets();
    }, [sortBy]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-800 border-red-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryInfo = (category: string) => {
        return categoryOptions.find(opt => opt.value === category) || categoryOptions[categoryOptions.length - 1];
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getTicketPriority = (ticket: SupportTicket) => {
        if (ticket.unread_count && ticket.unread_count > 0) return 'high';
        if (ticket.status === 'open') return 'medium';
        return 'low';
    };

    return (
        <div className="h-full flex flex-col">
            {/* Image Preview Modal */}
            {imagePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setImagePreview(null)}>
                    <div className="relative max-w-4xl max-h-4xl">
                        <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <a
                            href={imagePreview}
                            download
                            className="absolute top-4 left-4 bg-white rounded-full p-2 hover:bg-gray-100"
                        >
                            <Download className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            )}
            {currentView === 'inbox' ? (
                // Inbox View
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Support Inbox</h1>
                                <p className="text-gray-500">Manage customer support tickets and messages</p>
                            </div>
                            <Button onClick={loadTickets} variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categoryOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.icon} {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="updated_at">Last Updated</SelectItem>
                                    <SelectItem value="created_at">Date Created</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tickets List */}
                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                                <p className="text-gray-500">
                                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                                        ? 'Try adjusting your search filters'
                                        : 'All support tickets will appear here'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto h-full">
                                {filteredTickets.map((ticket) => {
                                    const categoryInfo = getCategoryInfo(ticket.category);
                                    const priority = getTicketPriority(ticket);

                                    return (
                                        <div
                                            key={ticket.id}
                                            className={`border-b border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-colors ${priority === 'high' ? 'bg-red-50 border-l-4 border-l-red-500' :
                                                priority === 'medium' ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setCurrentView('conversation');
                                                loadMessages(ticket.id);
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {ticket.subject}
                                                        </h3>
                                                        {ticket.unread_count && ticket.unread_count > 0 ? (
                                                            <Badge variant="destructive" className="text-xs">
                                                                {ticket.unread_count} new
                                                            </Badge>
                                                        ) : null}
                                                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            <span className="font-medium">{ticket.customer_name}</span>
                                                        </div>
                                                        {ticket.customer_email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-4 w-4" />
                                                                <span className="truncate max-w-48">{ticket.customer_email}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatTime(ticket.created_at)}</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 truncate mb-2">
                                                        {ticket.last_message}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`text-xs ${categoryInfo.color}`}>
                                                                {categoryInfo.icon} {categoryInfo.label}
                                                            </Badge>
                                                            {(ticket.attached_images && ticket.attached_images.length > 0) || ticket.attached_image ? (
                                                                <Badge variant="outline" className="text-xs">
                                                                    <ImageIcon className="h-3 w-3 mr-1" />
                                                                    {ticket.attached_images && ticket.attached_images.length > 1
                                                                        ? `${ticket.attached_images.length} Images`
                                                                        : 'Image'
                                                                    }
                                                                </Badge>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            #{ticket.ticket_number} • {ticket.last_activity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // Conversation View
                <div className="h-full flex flex-col">
                    {/* Conversation Header */}
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentView('inbox')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedTicket?.subject}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Ticket #{selectedTicket?.ticket_number} • Created {formatTime(selectedTicket?.created_at || '')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={selectedTicket?.status}
                                    onValueChange={(value) => selectedTicket && updateTicketStatus(selectedTicket.id, value)}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Customer Info */}
                        {selectedTicket && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Customer:</span>
                                        <p className="text-gray-900">{selectedTicket.customer_name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Email:</span>
                                        <p className="text-gray-900">{selectedTicket.customer_email || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Category:</span>
                                        <Badge className={`text-xs ${getCategoryInfo(selectedTicket.category).color} ml-2`}>
                                            {getCategoryInfo(selectedTicket.category).icon} {getCategoryInfo(selectedTicket.category).label}
                                        </Badge>
                                    </div>
                                </div>
                                {selectedTicket.status === 'closed' && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                        <p className="text-sm text-red-800 font-medium">⚠️ This ticket is closed. No new messages can be sent.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                        {/* Show initial ticket with image as first message if it exists */}
                        {selectedTicket && (
                            <div className="flex justify-start">
                                <div className="max-w-[70%] p-4 rounded-lg bg-gray-100 text-gray-900 border">
                                    <div className="text-xs text-gray-500 mb-2">
                                        <strong>Initial Request</strong> • Ticket #{selectedTicket.ticket_number}
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap mb-2">{selectedTicket.description}</p>
                                    {(selectedTicket.attached_images && selectedTicket.attached_images.length > 0) || selectedTicket.attached_image ? (
                                        <div className="mt-2">
                                            <div className="grid grid-cols-2 gap-2 max-w-md">
                                                {/* Show new multiple images if available */}
                                                {selectedTicket.attached_images && selectedTicket.attached_images.length > 0 ? (
                                                    selectedTicket.attached_images.map((imageUrl, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Customer attachment ${index + 1}`}
                                                                className="w-full h-24 rounded object-cover border cursor-pointer hover:opacity-75 transition-opacity"
                                                                onClick={() => setImagePreview(imageUrl)}
                                                            />
                                                            <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded p-1">
                                                                <ZoomIn className="h-3 w-3 text-white" />
                                                            </div>
                                                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : selectedTicket.attached_image ? (
                                                    <div className="relative">
                                                        <img
                                                            src={selectedTicket.attached_image}
                                                            alt="Customer attachment"
                                                            className="w-full max-w-48 max-h-32 rounded object-cover border cursor-pointer hover:opacity-75 transition-opacity"
                                                            onClick={() => setImagePreview(selectedTicket.attached_image!)}
                                                        />
                                                        <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded p-1">
                                                            <ZoomIn className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="text-xs mt-2 text-gray-500">
                                        {selectedTicket.customer_name} • {formatTime(selectedTicket.created_at)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Regular messages */}
                        {messages.map((message) => {
                            // Check if message contains embedded image
                            const hasImage = message.message.includes('[Image:');
                            const imageMatch = message.message.match(/\[Image: (.*?)\]/);
                            const imageUrl = imageMatch ? imageMatch[1] : null;
                            const textContent = message.message.replace(/\[Image: .*?\]/g, '').trim();

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-lg ${message.sender_type === 'admin'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900 border'
                                        }`}>
                                        {textContent && <p className="text-sm whitespace-pre-wrap">{textContent}</p>}
                                        {imageUrl && (
                                            <div className={`${textContent ? 'mt-2' : ''} relative`}>
                                                <img
                                                    src={imageUrl}
                                                    alt="Message attachment"
                                                    className="max-w-48 max-h-32 rounded object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                    onClick={() => setImagePreview(imageUrl)}
                                                />
                                                <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded p-1">
                                                    <ZoomIn className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <div className={`text-xs mt-2 ${message.sender_type === 'admin'
                                            ? 'text-blue-100'
                                            : 'text-gray-500'
                                            }`}>
                                            {message.sender_type === 'admin' ? 'You' : selectedTicket?.customer_name} • {formatTime(message.created_at)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Box */}
                    <div className="p-6 border-t bg-white">
                        {selectedTicket?.status === 'closed' ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500">This ticket is closed. No new messages can be sent.</p>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Textarea
                                    placeholder="Type your reply..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (newMessage.trim() && !sendingMessage) {
                                                sendMessage();
                                            }
                                        }
                                    }}
                                    className="min-h-[80px]"
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="h-auto"
                                >
                                    {sendingMessage ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <MessageCircle className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportInbox;
