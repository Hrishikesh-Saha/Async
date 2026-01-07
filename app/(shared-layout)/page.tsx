import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Async | Thoughts, Ideas & Everything In Between",
  description:
    "Async is a personal blog exploring ideas, experiences, technology, creativity, and everyday thoughts. A place to write freely, learn continuously, and share perspectives.",
  authors: [{ name: "Hrishikesh Saha" }],
};

export default function Home() {
  return (
    <div className="text-7xl font-semibold text-center mt-50">
      Developed By <span className="text-primary">Hrishikesh Saha</span>
    </div>
  );
}
