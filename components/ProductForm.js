import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        if (_id) {
            //Update
            await axios.put('/api/products', { ...data, _id });
        } else {
            //Create
            const data = { title, description, price };
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            console.log(res.data);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />

            <label>Photos</label>

            <div className="mb-2">
                <label className="w-24 h-24 cursor-pointer border text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>

            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}>
            </textarea>

            <label>Price(in USD)</label>
            <input type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}></input>
            <button type="submit"
                className="btn-primary">Save</button>
        </form>
    )
}