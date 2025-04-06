
import React, { useState } from "react";
import { Save, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Link2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string;
  isActive: boolean;
}

interface SocialMediaTabProps {
  socialLinks: SocialMedia[];
  updateSocialLinks: (links: SocialMedia[]) => void;
}

const SocialMediaTab = ({ socialLinks, updateSocialLinks }: SocialMediaTabProps) => {
  const [links, setLinks] = useState<SocialMedia[]>(socialLinks);

  const handleUrlChange = (id: string, value: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, url: value } : link
    ));
  };

  const handleToggleActive = (id: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const handleSave = () => {
    updateSocialLinks(links);
    toast.success("تم حفظ روابط التواصل الاجتماعي بنجاح");
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "github":
        return <Github className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Alert>
          <Link2 className="h-5 w-5" />
          <AlertTitle>إدارة روابط التواصل الاجتماعي</AlertTitle>
          <AlertDescription>
            يمكنك إضافة وتعديل روابط مواقع التواصل الاجتماعي التي ستظهر في الموقع. يمكنك أيضًا تفعيل أو تعطيل أي رابط.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((link) => (
          <Card key={link.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-reverse space-x-2">
                <div className="p-2 rounded-full bg-primary/10">
                  {getIconComponent(link.icon)}
                </div>
                <CardTitle className="text-xl">{link.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                {link.isActive ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <label className="switch">
                  <input 
                    className="ch" 
                    type="checkbox" 
                    checked={link.isActive}
                    onChange={() => handleToggleActive(link.id)}
                  />
                  <span className="slider" />
                </label>
                <style>{`
                  .switch {
                    font-size: 17px;
                    position: relative;
                    display: inline-block;
                    width: 3.5em;
                    height: 1.5em;
                  }
                  .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                  }
                  .slider {
                    position: absolute;
                    cursor: pointer;
                    inset: 0;
                    background-color: #ccc;
                    transition: 0.4s;
                    border-radius: 1rem 0rem 1rem;
                  }
                  .slider:before {
                    position: absolute;
                    content: "";
                    height: 1.5em;
                    width: 1.4em;
                    left: 0em;
                    bottom: 0em;
                    background-color: white;
                    transition: 0.4s;
                    border-radius: 1rem 0rem 1rem;
                    border: 3px solid white;
                  }
                  .ch:checked + .slider {
                    background-color: #72eb67;
                  }
                  .ch:focus + .slider {
                    box-shadow: 0 0 1px #2196f3;
                  }
                  .ch:checked + .slider:before {
                    transform: translateX(2.2em);
                    background-color: green;
                    box-shadow: 0px 0px 40px 5px #72eb67;
                    border: 3px solid white;
                  }
                  .ch:checked + .slider::after {
                    content: "|";
                    color: white;
                    position: absolute;
                    right: 0.3rem;
                    top: -3.3px;
                    transform: rotate(45deg);
                  }
                `}</style>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                أدخل الرابط الكامل لصفحة {link.name} الخاصة بك
              </CardDescription>
              <div className="space-y-2">
                <Label htmlFor={`url-${link.id}`}>الرابط</Label>
                <Input
                  id={`url-${link.id}`}
                  type="url"
                  placeholder={`https://www.${link.icon}.com/yourname`}
                  value={link.url}
                  onChange={(e) => handleUrlChange(link.id, e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-sm text-muted-foreground">
                {link.isActive ? (
                  <span className="text-green-500">هذا الرابط مفعل وسيظهر في الموقع</span>
                ) : (
                  <span>هذا الرابط معطل ولن يظهر في الموقع</span>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2" variant="default">
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaTab;
