import Updater from "@/components/utility/Updater";
import "../styles/stats.scss";
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartConfig = {
    platform: {
        label: "Platform",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    Modrinth: {
        label: "Modrinth",
        color: "hsl(var(--chart-2))",
    },
    CurseForge: {
        label: "CurseForge",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig

const chartData = [
    { platform: "Modrinth", count: 275, fill: "green" },
    { platform: "CurseForge", count: 200, fill: "orange" }
]
const Stats = () => {
    Updater();
    const addonList = localStorage.getItem('addonList');
    const addonListJson = addonList ? JSON.parse(addonList) : [];

    // Aggregate version data
    const versions = addonListJson.reduce((acc, addon) => {
        if (addon.versions) {
            addon.versions.forEach((version) => {
                acc[version] = (acc[version] || 0) + 1;
            });
        }
        return acc;
    }, {});

    // Generate chart data, filtering out versions with 0 addons
    const chartDataVersions = Object.keys(versions)
        .filter((version) => versions[version] > 0) // Exclude versions with a count of 0
        .map((version) => ({
            version,
            count: versions[version],
        }));

    const chartConfigVersions = {
        count: {
            label: "How many?",
        },
    } satisfies ChartConfig;

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
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                    >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartData} dataKey="count" label nameKey="platform" />
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className="bg-blue-500">
                    <h2 className="text-foreground text-center">Version Distribution</h2>
                    <ChartContainer config={chartConfigVersions} className="max-w-[500px] mx-auto">
                        <BarChart data={chartDataVersions}>
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
                            <Bar dataKey="count" fill="#60A5FA" radius={8} /> {/* Updated fill */}
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </>
    );
};

export default Stats;


