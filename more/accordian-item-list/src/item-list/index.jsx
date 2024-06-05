import React from "react";
import useSWR from "swr";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Progress } from "@/components/ui/progress.jsx"

import { kf } from "../sdk/index.js";

export const SprintTaskList = () => {
  const [filter, setFilter] = React.useState("InProgress");
  const [sprintId, setSprintId] = React.useState(null);

  React.useEffect(() => {
    kf.context.watchParams((data) => {
      if (data.sprintId) {
        console.log("watch param change ", data.sprintId);
        setSprintId(data.sprintId);
      }
    });
  }, []);

  const {
    data: sprint,
    error: sprintError,
    isLoading: sprintLoading,
  } = useSWR(
    () => (sprintId ? sprintId : null),
    async (sprintId) => {
      return await kf.api(
        `/case/2/${kf.account._id}/Sprint_Plan_A01/${sprintId}`
      );
    }
  );

  const {
    data: features,
    error,
    isLoading: featuresLoading,
  } = useSWR(() => `getItem-${sprint._id}`, async () => {
    const res = await kf.api(`/form/2/${kf.account._id}/Sprint_Feature_Mapping_A00/allitems/list`, {
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
    }).catch((err) => {
        console.log("list error", err);
        return {
          Data: []
        }
    });
    return res.Data;
  });

  const {
    data: statusByCategory,
    error: schemaLoadError,
    isLoading: schemaLoading,
  } = useSWR(
    () => (sprintId ? `caseFlow` : null),
    async (sprintId) => {
      const schema = await kf.api(
        `/metadata/2/${kf.account._id}/case/Feature_Board_A02/caseflow/Feature_Board_A02_flow_A00`
      );
      const statuses = schema["Feature_Board_A02_flow_A00"]["CaseFlow::Status"];
      const statusByCategory = statuses.reduce((acc, statusId) => {
        const status = schema[statusId];
        acc[status.Category] = acc[status.Category] || [];
        acc[status.Category].push(status.Name);
        return acc;
      }, {});
      return statusByCategory;
    }
  );

  const filterData = React.useMemo(() => {
    if(!features) { return []; }
    if (filter === "All") return features || [];

    return features.filter((item) =>
      filter.split(",").includes(item.Category)
    );
  }, [filter, features]);

  const getProgressForItem = ({ Status: statusName, Category }) => {
    console.log("Status categriy in progress ", statusByCategory);
    if(!statusByCategory || Category == "NotStarted") {
      return 0;
    }else if(Category == "Done") {
      return 95;
    }else if(Category == "Completed") {
      return 100;
    }else if(Category == "InProgress") {
      const statuses = statusByCategory[Category] || [];
      const progress = ((statuses.indexOf(statusName)+1) / statuses.length) * 100;
      console.log("calculated progress ",statusName, (statuses.indexOf(statusName)+1) / statuses.length, progress);
      return progress == 100 ? 90 : progress;
    }
  }

  const openForm = (item) => {

  }

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        value={filter}
        aria-label="item filters"
        onValueChange={(value) => {
          console.log("filter value setting ", value);
          if (value) setFilter(value);
        }}
      >
        <ToggleGroupItem
          className="data-[state=on]:bg-blue-400 data-[state=on]:text-white hover:bg-blue-100"
          value="All"
        >
          All
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-blue-400 data-[state=on]:text-white hover:bg-blue-100"
          value="NotStarted"
        >
          NotStarted
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-blue-400 data-[state=on]:text-white hover:bg-blue-100"
          value="InProgress"
        >
          InProgress
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-blue-400 data-[state=on]:text-white hover:bg-blue-100"
          value="Done,Completed"
        >
          Completed
        </ToggleGroupItem>
      </ToggleGroup>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Id</TableHead>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead className="w-[250px]">Status</TableHead>
            <TableHead className="w-[200px]">Due date</TableHead>
            <TableHead className="w-[250px]">Progress</TableHead>
            <TableHead>Assginee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {featuresLoading &&
            [1, 2].map((index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Skeleton className="w-[80%] h-[10px] rounded-md" />
                  </TableCell>
                </TableRow>
              );
            })}
          {filterData.map((item) => (
            <TableRow key={item._id} onClick={() => openForm(item)}>
              <TableCell className="font-medium">
                <Badge variant="secondary">{item._id}</Badge>
              </TableCell>
              <TableCell className="font-medium">{item.Title}</TableCell>
              <TableCell>
                <Badge>{item.Category}</Badge>
              </TableCell>
              <TableCell>{item.DueDate}</TableCell>
              <TableCell>
                <Progress className="w-full h-[10px]" value={getProgressForItem(item)}></Progress>
              </TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {item.Stackholders.map((user) => {
                  return (
                    <Badge
                      className="flex gap-1 px-2 rounded-md"
                      variant="secondary"
                    >
                      <Avatar className="w-[20px] h-[20px]">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={user.Name}
                        />
                        <AvatarFallback>
                          {user.Name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p>{user.Name}</p>
                    </Badge>
                  );
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
