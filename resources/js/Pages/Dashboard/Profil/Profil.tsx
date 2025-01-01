import { useState, useEffect } from 'react';
import { UserEdit } from '@/Components/Dashboard/Components/Profil/UserEdit';
import { UserInfo } from '@/Components/Dashboard/Components/Profil/UserInfo';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

interface ProfilPageProps {
    user: User;
}

const ProfilPage = () => {
    const { user: initialUser } = usePage<PageProps & ProfilPageProps>().props;

    const [user, setUser] = useState<User>({
        ...initialUser,
        no_telepon: initialUser.no_telepon || '',
    });

    useEffect(() => {
        setUser({
            ...initialUser,
            no_telepon: initialUser.no_telepon || '',
        });
    }, [initialUser]);

    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <DashboardLayout>
            <Head title="Profil" />

            <div className="flex flex-col lg:grid lg:grid-cols-2 w-full rounded-xl gap-4">
                <div className="grid col-span-1">
                    <UserInfo user={user} />
                </div>
                <div className="grid col-span-1">
                    <UserEdit user={user} onUpdate={handleUpdateUser} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilPage;
