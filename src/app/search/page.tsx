import { redirect } from "next/navigation";
import PostList from "@/components/posts/post-list";
import { fetchPostBySearchTerm } from "@/db/queries/posts";



interface SearchPageProps {
    searchParams: {
        term: string;
    }
}

export default async function SearchPahe({searchParams}: SearchPageProps){
    const {term} = searchParams;

    if(!term){
        redirect('/');
    }

    return <div>
        <PostList fetchData={() => fetchPostBySearchTerm(term)}/>
    </div>;
}