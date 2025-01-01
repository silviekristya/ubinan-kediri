import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { UpdateProfilComponents } from "@/Components/Dashboard/Components/Profil/Update/UpdateProfil";
import { UpdatePasswordComponents } from "@/Components/Dashboard/Components/Profil/Update/UpdatePassword";
import { Card } from "@/Components/ui/card";

interface UserEditProps {
  user: any;
  onUpdate: (user: any) => void;
}

export const UserEdit = ({ user, onUpdate }: UserEditProps) => {
  return (
    <Card className="w-full shadow-md p-4">
      <Tabs defaultValue="ubahProfil">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ubahProfil">Ubah Profil</TabsTrigger>
          <TabsTrigger value="ubahPassword">Ubah Password</TabsTrigger>
        </TabsList>

        <TabsContent value="ubahProfil">
          <UpdateProfilComponents user={user} onUpdate={onUpdate} />
        </TabsContent>
        <TabsContent value="ubahPassword">
          <UpdatePasswordComponents />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
