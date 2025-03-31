
import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Globe } from "lucide-react";
import { SocialMedia } from "../admin/SocialMediaTab";

interface SocialIconsProps {
  links: SocialMedia[];
  className?: string;
  iconSize?: number;
}

const SocialIcons = ({ links, className = "", iconSize = 5 }: SocialIconsProps) => {
  const getIconComponent = (iconName: string) => {
    const props = { className: `h-${iconSize} w-${iconSize}` };
    
    switch (iconName) {
      case "facebook":
        return <Facebook {...props} />;
      case "twitter":
        return <Twitter {...props} />;
      case "instagram":
        return <Instagram {...props} />;
      case "youtube":
        return <Youtube {...props} />;
      case "linkedin":
        return <Linkedin {...props} />;
      case "github":
        return <Github {...props} />;
      default:
        return <Globe {...props} />;
    }
  };

  const activeLinks = links.filter(link => link.isActive && link.url);

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-reverse space-x-4 ${className}`}>
      {activeLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          title={link.name}
        >
          {getIconComponent(link.icon)}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
