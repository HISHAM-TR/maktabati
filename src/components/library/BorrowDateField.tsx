
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BorrowDateFieldProps {
  borrowDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const BorrowDateField = ({ borrowDate, onDateChange }: BorrowDateFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right text-lg">
        تاريخ الإعارة
      </Label>
      <div className="col-span-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-right font-normal text-lg py-6",
                !borrowDate && "text-muted-foreground"
              )}
            >
              <Calendar className="ml-2 h-4 w-4" />
              {borrowDate ? (
                format(borrowDate, "yyyy-MM-dd")
              ) : (
                <span>اختر تاريخ الإعارة</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <CalendarComponent
              mode="single"
              selected={borrowDate || undefined}
              onSelect={onDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BorrowDateField;
