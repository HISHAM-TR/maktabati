
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Settings, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/App";

const Index = () => {
  // Set title on mount
  useEffect(() => {
    document.title = "Library Management System";
  }, []);

  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Manage Your Personal Library With Ease
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Organize, track, and discover your book collection with our modern library management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in">
              <div className="glass p-8 rounded-2xl max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-primary/5 p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Book className="h-6 w-6 text-primary" />
                      </div>
                      <div className="h-2 w-16 bg-primary/10 rounded-full mt-2"></div>
                      <div className="h-2 w-10 bg-primary/10 rounded-full mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-xl animate-fade-in">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Libraries</h3>
              <p className="text-muted-foreground">
                Create and manage multiple libraries to organize your book collection by genres, authors, or any system you prefer.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-muted-foreground">
                Easily find any book in your collection with powerful search capabilities by title, author, or category.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
              <p className="text-muted-foreground">
                Administrators can manage users, monitor libraries, and access detailed statistics about the system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass p-8 md:p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to organize your collection?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of book lovers who are managing their personal libraries with our system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg">
                      Create an Account
                      <UserPlus className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
