
import React from "react";
import { Library, User, Calendar } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";

interface Library {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  bookCount: number;
  creationDate: string;
}

interface LibrariesTabProps {
  filteredLibraries: Library[];
  handleLibrarySearch: (query: string) => void;
}

const LibrariesTab = ({
  filteredLibraries,
  handleLibrarySearch,
}: LibrariesTabProps) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <SearchBar
          onSearch={handleLibrarySearch}
          placeholder="ابحث عن المكتبات بالاسم أو المالك..."
        />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableCaption>قائمة جميع المكتبات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">المالك</TableHead>
                <TableHead className="text-right">الكتب</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLibraries.map((library) => (
                <TableRow key={library.id}>
                  <TableCell className="font-medium text-right">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Library className="h-4 w-4 text-primary" />
                      </div>
                      <span>{library.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{library.owner}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {library.ownerEmail}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{library.bookCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{library.creationDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibrariesTab;
