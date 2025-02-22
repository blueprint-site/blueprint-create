import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog.tsx";
import { Download, Heart } from "lucide-react";
import { Schematic } from "@/types";
import { format } from "date-fns";
import {useDeleteSchematics, useFetchUserSchematics} from "@/api/endpoints/useSchematics.tsx";
import {useLoggedUser} from "@/api/context/loggedUser/loggedUserContext.tsx";
import {useThemeStore} from "@/api/stores/themeStore.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import MinecraftIcon from "@/components/utility/MinecraftIcon.tsx";


const UserSchematicList = () => {
    const { isDarkMode } = useThemeStore();
    const LoggedUserInfo = useLoggedUser();
    // Fetch user schematics
    const { data: userSchematics } = useFetchUserSchematics(LoggedUserInfo?.user?.$id || '');
    console.log("user schematics", userSchematics);

    // Mutation to delete schematic
    const { mutate: deleteSchematic } = useDeleteSchematics(LoggedUserInfo?.user?.$id);

    // Delete handler
    const handleDelete = (id: string) => {
        deleteSchematic(id, {
            onSuccess: () => {
                console.log(`Schematic ${id} deleted successfully`);
            },
            onError: (error) => {
                console.error("Failed to delete schematic:", error);
            },
        });
    };

    return (
        <div className="mt-2">
            <h2>My schematics</h2>
            <div className="mt-2 flex gap-2">
                {userSchematics ? userSchematics.map((schematic: Schematic) => (
                    <Card key={schematic.$id} className={`bg cursor-pointer hover:bg-accent/50 transition-colors duration-200 mt-4 w-1/2 relative  ${
                        isDarkMode ? "bg-shadow_steel_casing" : "bg-refined_radiance_casing"
                    }`}>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={schematic.image_url} alt={schematic.title} />
                                    <AvatarFallback>{schematic.title.slice(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="">
                                    <h3 className="text-lg font-semibold text-card-foreground">{schematic.title}</h3>
                                    <p className="text-sm text-foreground-muted">{schematic.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-foreground-muted">
                                <div className="flex items-center">
                                    <Heart className="w-4 h-4 mr-1 text-destructive" />
                                    <span>{schematic.likes}</span>
                                </div>
                                <div className="flex items-center">
                                    <Download className="w-4 h-4 mr-1" />
                                    <span>{schematic.downloads}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex items-center text-xs">
                                Created : {format(new Date(schematic.$createdAt), "dd/MM/yyyy HH:mm")}
                            </div>
                            <div className="flex items-center text-xs">
                                Updated : {format(new Date(schematic.$updatedAt), "dd/MM/yyyy HH:mm")}
                            </div>
                        </CardContent>

                        {/* Delete Button with AlertDialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button  className="absolute cursor-pointer top-1 right-1 text-destructive ">
                                    <MinecraftIcon name={'trash'} className={'absolute top-1 right-1 '} size={32} />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Schematic</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{schematic.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(schematic.$id)} className="text-destructive">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Card>
                )) : null}
            </div>

        </div>
    );
};

export default UserSchematicList;
