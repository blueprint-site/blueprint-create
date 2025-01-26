import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import Updater from "@/components/utility/Updater";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import "../styles/stats.scss";
  
  const platformChartConfig = {
    platform: {
      label: "Platform",
    },
    Modrinth: {
      label: "Modrinth",
      color: "hsl(var(--success))",
    },
    CurseForge: {
      label: "CurseForge", 
      color: "hsl(var(--warning))",
    },
  } satisfies ChartConfig;
  
  const versionChartConfig = {
    count: {
      label: "How many?",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  
  const platformData = [
    { platform: "Modrinth", count: 275, fill: "hsl(var(--success))" },
    { platform: "CurseForge", count: 200, fill: "hsl(var(--warning))" }
  ];
  
  const Stats = () => {
    Updater();
    const addonList = localStorage.getItem('addonList');
    const addonListJson = addonList ? JSON.parse(addonList) : [];
    
    const versions = addonListJson.reduce((acc, addon) => {
      if (addon.versions) {
        addon.versions.forEach((version) => {
          acc[version] = (acc[version] || 0) + 1;
        });
      }
      return acc;
    }, {});
  
    const versionData = Object.keys(versions)
      .filter((version) => versions[version] > 0)
      .map((version) => ({
        version,
        count: versions[version],
      }));
  
    return (
      <>
        <h1 className="text-center">Stats</h1>
        <div className="bg-blueprint">
          <div className="bg-blueprint">
            <h2 className="text-center">Addons counted:</h2>
            <h1 className="text-foreground text-center">{addonListJson.length}</h1>
          </div>
          <div className="bg-blueprint">
            <h2 className="text-foreground text-center">Platform Distribution</h2>
            <ChartContainer
              config={platformChartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={platformData} dataKey="count" label nameKey="platform" />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="bg-blue-500">
            <h2 className="text-foreground text-center">Version Distribution</h2>
            <ChartContainer config={versionChartConfig} className="max-w-[500px] mx-auto">
              <BarChart data={versionData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="version"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 20)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={8} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </>
    );
  };
  
  export default Stats;