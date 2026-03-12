import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Listing, type ListingResponse } from "../types";

const CATEGORIES = ['Electronics', 'Clothing', 'Furniture', 'Books', 'Vehicles', 'Sports', 'Toys', 'Food', 'Other'];

const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'poor'];

export default function Home() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [page, setPage] = useState(1);

    // useQuery replaces useEffect + useState + loading state! 
    const { data, isLoading, isError} = useQuery({
        queryKey: ['listings', search, category, condition, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if(search) params.append('search', search);
            if(category) params.append('category', category);
            if(condition) params.append('condition', condition);
            params.append('page', String(page));

            const res = await api.get<ListingResponse>('/listings?' + params.toString());
            return res.data;


        },
    });
}