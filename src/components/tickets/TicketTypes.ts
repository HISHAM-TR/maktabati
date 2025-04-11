
export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  userId: string;
  userName: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface TicketFormData {
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
}
