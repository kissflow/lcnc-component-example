import React from "react";
import useSWR from "swr";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";

import { kf } from "../sdk/index.js";
import { useMemo } from "react";

export function TableDemo() {
  const { data, error, isLoading } = useSWR("getSprintList", async () => {
    return kf.api(
      `/case/2/${kf.account._id}/Sprint_Plan_A01/list/items?view_id=Sprint_List_View_A00&apply_preference=true&q=&page_size=200`
    );
  });

  const progress = useMemo(
    function () {
      if (!data) return 0;
    },
    [data]
  );

  const gotoSprintPage = (sprint) => {
    kf.app.openPage("Sprint_Detail_Page_A00", {
      sprintId: sprint._id
    });
  }

  return isLoading ? (
    <TableSkeleton />
  ) : (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.Data.map((sprint) => (
          <TableRow key={sprint._id} onClick={() => gotoSprintPage(sprint)}>
            <TableCell className="font-medium text-center">{sprint.Name}</TableCell>
            <TableCell className="text-center">
              <SprintStatus status={sprint._status_name} />
            </TableCell>
            <TableCell className="flex justify-center">
              <SprintProgress sprint={sprint} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}

function SprintStatus({status}) {
  console.log("sprint status ", status);
  let badge = null;
  switch (status) {
    case "NotStarted":
      badge = <Badge variant={"secondary"}>{status}</Badge>;
      break;
    case "InProgress":
      badge = <Badge className="bg-orange-300 text-white">{status}</Badge>;
      break;
    case "Completed":
      badge = <Badge>{status}</Badge>;
      break;
    default:
  }
  return badge;
}

function SprintProgress({ sprint }) {
  const {
    data: features,
    error,
    isLoading,
  } = useSWR(`getItem-${sprint._id}`, async () => {
    const res = kf.api(`/form/2/${kf.account._id}/Sprint_Feature_Mapping_A00/allitems/list`, {
      method: "POST",
      body: JSON.stringify({
        "Filter": {
          "AND": [
              {
                  "OR": [
                      {
                          "LHSField": "SprintId",
                          "Operator": "EQUAL_TO",
                          "RHSType": "Value",
                          "RHSValue": sprint._id,
                      }
                  ]
              }
          ]
      }
      }),
    }).catch(err => {
      console.log("error ", err);
      return {
        Data: []
      }
    });
    return res.Data;
  });

  const progress = React.useMemo(() => {
    if (!features) return 0;
    
    const completedFeaturesCount = features.filter((feature) => {
      return ["Done", "Completed"].includes(feature.Category);
    }).length;

    const progress = (completedFeaturesCount / features.length) * 100;
    return progress;
  }, [features]);

  return isLoading ? (
    <Skeleton className="w-[100px] h-2 rounded" />
  ) : (
    <Progress value={progress} className="w-40 h-2" />
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <Skeleton className="h-10 w-full" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
    </div>
  );
}
