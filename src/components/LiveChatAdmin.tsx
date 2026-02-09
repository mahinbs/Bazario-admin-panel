import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MessageCircle,
    Send,
    RefreshCw,
    User,
    Bot,
    Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockTickets, fetchMockMessages, delay, mockTickets, mockMessages, SupportTicket, SupportMessage } from "@/lib/mockData";

const LiveChatAdmin: React.FC = () => {
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Category options
    const categoryOptions = [
        { value: 'order_issues', label: '📦 Order Issues', color: 'bg-blue-100 text-blue-800' },
        { value: 'food_quality', label: '🍔 Food Quality', color: 'bg-red-100 text-red-800' },
        { value: 'delivery_issues', label: '🚴 Delivery Issues', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'payment_issues', label: '💳 Payment Issues', color: 'bg-purple-100 text-purple-800' },
        { value: 'account_issues', label: '👤 Account Issues', color: 'bg-green-100 text-green-800' },
        { value: 'other', label: '❓ Other', color: 'bg-gray-100 text-gray-800' }
    ];

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load all support tickets
    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await fetchMockTickets();
            const ticketsWithCustomerNames = data.map(ticket => ({
                ...ticket,
                customer_name: ticket.customer_name || 'Unknown Customer'
            }));
            setTickets(ticketsWithCustomerNames);
        } catch (error: any) {
            console.error('Error loading tickets:', error);
            toast({
                title: "Error",
                description: "Failed to load support tickets",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Load messages for selected ticket
    const loadMessages = async (ticketId: string) => {
        try {
            const data = await fetchMockMessages(ticketId);
            setMessages(data);
        } catch (error: any) {
            console.error('Error loading messages:', error);
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
        }
    };

    // Send message as admin
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket || sendingMessage) return;

        setSendingMessage(true);
        try {
            await delay(500); // Simulate network delay

            const newMsg: SupportMessage = {
                id: `msg-${Date.now()}`,
                ticket_id: selectedTicket.id,
                ticketId: selectedTicket.id, // Ensure compatibility with both interfaces if they differ
                sender_type: 'admin',
                sender_id: 'admin',
                message: newMessage.trim(),
                created_at: new Date().toISOString()
            } as any; // Cast to any to avoid strict type checking against slightly differing mock types

            // Update local state to show message immediately
            setMessages(prev => [...prev, newMsg]);

            // Update ticket status to in_progress if it was open
            if (selectedTicket.status === 'open') {
                updateTicketStatus(selectedTicket.id, 'in_progress');
            }

            setNewMessage('');

            toast({
                title: "Message sent",
                description: "Your response has been sent to the customer",
            });
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        } finally {
            setSendingMessage(false);
        }
    };

    // Update ticket status
    const updateTicketStatus = async (ticketId: string, status: string) => {
        try {
            await delay(300);

            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: status as any, updated_at: new Date().toISOString() } : t
            ));

            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => prev ? { ...prev, status: status as any } : null);
            }

            toast({
                title: "Status updated",
                description: `Ticket status updated to ${status}`,
            });
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update ticket status",
                variant: "destructive",
            });
        }
    };

    // Initial load
    useEffect(() => {
        loadTickets();
    }, []);

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryInfo = (category: string) => {
        const option = categoryOptions.find(opt => opt.value === category);
        return option || { value: 'other', label: '❓ Other', color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-4">
            {/* Tickets List */}
            <Card className="w-1/3">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Support Tickets
                        </CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={loadTickets}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
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
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categoryOptions.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => {
                                    setSelectedTicket(ticket);
                                    loadMessages(ticket.id);
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">
                                            {ticket.subject}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                            {ticket.customer_name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            #{ticket.ticket_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs ${getStatusColor(ticket.status)}`}
                                    >
                                        {ticket.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs ${getCategoryInfo(ticket.category).color}`}
                                    >
                                        {getCategoryInfo(ticket.category).label}
                                    </Badge>
                                </div>

                                {ticket.attached_image && (
                                    <div className="mt-2">
                                        <img
                                            src={ticket.attached_image}
                                            alt="Attached"
                                            className="w-full max-w-20 h-12 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(ticket.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}

                        {filteredTickets.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No tickets found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1">
                {selectedTicket ? (
                    <>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        {selectedTicket.subject}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {selectedTicket.customer_name} • #{selectedTicket.ticket_number}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select
                                        value={selectedTicket.status}
                                        onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
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

                            {/* Initial Description */}
                            <div className="bg-gray-50 p-3 rounded text-sm">
                                <strong>Initial Request:</strong> {selectedTicket.description}
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-col h-[calc(100vh-320px)]">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${message.sender_type === 'admin'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {message.sender_type === 'admin' ? (
                                                    <Bot className="h-3 w-3" />
                                                ) : (
                                                    <User className="h-3 w-3" />
                                                )}
                                                <span className="text-xs opacity-75">
                                                    {message.sender_type === 'admin' ? 'Admin' : 'Customer'}
                                                </span>
                                                <span className="text-xs opacity-75">
                                                    {new Date(message.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm">{message.message}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Type your response..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    className="resize-none"
                                    rows={2}
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="px-4"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <CardContent className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">Select a ticket to start chatting</p>
                            <p className="text-sm">Choose a support ticket from the list to view and respond to customer messages</p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default LiveChatAdmin;
