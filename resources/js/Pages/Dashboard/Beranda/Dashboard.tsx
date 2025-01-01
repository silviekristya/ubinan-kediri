import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import { PageProps, WithCsrf } from "@/types";
import DashboardLayout from "@/Layouts/DashboardLayout";

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale("id");

interface DashboardPageProps extends PageProps, WithCsrf {
}

export default function DashboardPage() {
    const pageProps = usePage<DashboardPageProps>().props;

  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 w-full">
        <div>
          <Card className="w-full shadow-md">
            <CardHeader className="text-base sm:text-xl font-semibold text-center">
                Judul
            </CardHeader>
            <CardContent className="p-0">
                <div>
                    Konten
                </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="w-full shadow-md">
            <CardHeader className="text-base sm:text-xl font-semibold text-center">
              Judul
            </CardHeader>
            <CardContent className="p-0">
                <div>
                    Konten
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
