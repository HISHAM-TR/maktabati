
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardActions from "./library-card/CardActions";
import CardIcon from "./library-card/CardIcon";
import CardStats from "./library-card/CardStats";

interface LibraryCardProps {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  volumeCount?: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const LibraryCard = ({ 
  id, 
  name, 
  description, 
  bookCount, 
  volumeCount = 0,
  onDelete, 
  onEdit 
}: LibraryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`card-hover overflow-hidden ${
        isHovered ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 relative">
        <CardActions id={id} onEdit={onEdit} onDelete={onDelete} />
        <CardIcon />
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <CardStats bookCount={bookCount} volumeCount={volumeCount} />
      </CardContent>
      
      <CardFooter>
        <Link to={`/library/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            عرض المكتبة
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LibraryCard;
