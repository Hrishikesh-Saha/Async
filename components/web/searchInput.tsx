import { Loader2, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const SearchInput = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const results = useQuery(
    api.blogs.searchBlogs,
    term.length >= 2 ? { limit: 5, term: term } : "skip"
  );
  return (
    <div className="max-w-sm w-full relative">
      <div className="relative ">
        <SearchIcon className="left-2.5 top-2.5 absolute size-4 text-muted-foreground" />
        <Input
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          placeholder="Search Blogs..."
          className="w-full bg-background pl-8"
        />
      </div>
      {open && term.length >= 2 && (
        <div className="absolute z-50 top-full mt-2 bg-popover border rounded-md text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 animate-spin size-4"/>
                Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No Results Found!</p>
          ) : (
            <div className="py-1">
              {results.map((blog) => (
                <Link
                  href={`/blogs/${blog._id}`}
                  className="flex flex-col px-4 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setTerm("")
                    setOpen(false)
                  }}
                >
                  <p className="font-medium truncate">{blog.title}</p>
                  <p className="text-xs text-muted-foreground pt-1 line-clamp-2">{blog.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
