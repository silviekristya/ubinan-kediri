import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

interface UserInfoProps {
  user: {
    nama: string;
    no_telepon?: string;
    email: string;
    role?: string;
  };
}

const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'outline';
      default:
        return 'secondary';
    }
  };


export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="text-2xl font-semibold text-center">Profil</CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: 'Nama', value: user.nama },
          { label: 'No Telepon', value: user.no_telepon || '-' },
          { label: 'Email', value: user.email },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
          >
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-sm font-normal text-muted-foreground">{item.value}</p>
          </div>
        ))}

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {user.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : 'Tidak Diketahui'}
          </Badge>
        </div>

      </CardContent>
    </Card>
  );
};
