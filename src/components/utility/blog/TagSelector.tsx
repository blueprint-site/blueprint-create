import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabase from "@/components/utility/Supabase.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {HexColorPicker} from "react-colorful";
import {Tag} from "@/types";


interface TagSelectorProps {
    value?: Tag[];
    onChange?: (selectedTags: Tag[]) => void;
}

export default function TagSelector({value, onChange }: TagSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState("");
    const [newTagColor, setNewTagColor] = useState("#3498db");

    useEffect(() => {
        setSelectedTags(value || []);
        fetchTags().then();
    }, [value]);

    async function fetchTags() {
        const { data, error } = await supabase.from("blog_tags").select("id, value, color");
        if (!error) setTags(data || []);
    }

    async function createTag() {
        if (!newTag) return;
        const { data, error } = await supabase
            .from("blog_tags")
            .insert([{ value: newTag, color: newTagColor }])
            .select("id, value, color");
        if (!error && data) setTags((prev) => [...prev, ...data]);
        setNewTag("");
        setNewTagColor("#3498db");
    }

    async function deleteTag(id: number) {
        const { error } = await supabase.from("blog_tags").delete().eq("id", id);
        if (!error) setTags((prev) => prev.filter((tag) => tag.id !== id));
    }

    function toggleTagSelection(tag: Tag) {
        setSelectedTags((prev) => {
            const exists = prev.find((t) => t.id === tag.id);
            const updatedTags = exists ? prev.filter((t) => t.id !== tag.id) : [...prev, tag];
            onChange?.(updatedTags);
            return updatedTags;
        });
    }

    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="w-1/4">
                    <Select onValueChange={(value) => {
                        const tag = tags.find(t => t.value === value);
                        if (tag) toggleTagSelection(tag);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tags"/>
                        </SelectTrigger>
                        <SelectContent className=" bg-foreground hover:bg-foreground">
                            {tags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.value}>
              <span className="flex justify-between items-center ">
                <span className="mr-2" style={{color: tag.color}}>{tag.value}</span>
                <Button variant="ghost" size="sm" onClick={() => deleteTag(tag.id)}>
                  ❌
                </Button>
              </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-2/4">

                </div>
                <div className=" flex flex-row w-1/4 gap-4">
                    <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag name"
                    />
                    <Popover>
                        <PopoverTrigger className="w-10 h-10 border rounded" style={{background: newTagColor}}/>
                        <PopoverContent className="p-2">
                            <HexColorPicker color={newTagColor} onChange={(e) => setNewTagColor(e)}/>
                        </PopoverContent>
                    </Popover>
                </div>

                <Button className="" onClick={createTag}>Add</Button>
            </div>
            <h3>Selected Tags :</h3>
            <div className="flex flex-wrap gap-2 m-2">
                {selectedTags.map((tag) => (
                    <span key={tag.id} className="px-1 py-1 text-foreground rounded"
                          style={{backgroundColor: tag.color}}>
              {tag.value}
            </span>
                ))}
            </div>
        </>
    );
}
