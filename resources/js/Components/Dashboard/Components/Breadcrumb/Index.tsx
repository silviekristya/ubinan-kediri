import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/Components/ui/breadcrumb";

const BreadcrumbComponent: React.FC = () => {
    const { url } = usePage(); // Dapatkan URL path dari Inertia.js
    const pathname = url;
    const pathNames = pathname.split("/").filter(x => x);

    // Convert dashes to spaces and capitalize the first letter
    const formatPathName = (path: string): string => {
        return path
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const isUUID = (str: string): boolean => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(str);
    };

    // Prepare breadcrumb items
    const breadcrumbItems = pathNames.map((link, index) => {
        if (link === 'admin' || isUUID(link)) return null;
        const href = `/${pathNames.slice(0, index + 1).join('/')}`;
        const itemLink = formatPathName(link);

        if (itemLink === 'Detail') {
            return { href, itemLink, isLast: index === pathNames.length - 2 };
        }
        else {
            return { href, itemLink, isLast: index === pathNames.length - 1 };
        }
    }).filter(item => item !== null);

    const combinedBreadcrumbItems = breadcrumbItems.reduce((acc: any[], item, index) => {
        acc.push(item);
        return acc;
    }, []);

    return (
        <div className="mb-4">
            <h1 className="font-bold text-2xl">
                {breadcrumbItems.length > 0
                    ? formatPathName(pathNames[pathNames.length - 1])
                    : 'Home'}
            </h1>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {combinedBreadcrumbItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {item?.isLast ? (
                                    <BreadcrumbPage className="font-bold">
                                        {item.itemLink}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href} className={pathname === item.href ? 'font-bold' : 'cursor-pointer'}>
                                            {item.itemLink}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

export default BreadcrumbComponent;
