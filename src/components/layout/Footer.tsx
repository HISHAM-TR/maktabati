
import { Book } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Book className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Library Manager</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Library Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
