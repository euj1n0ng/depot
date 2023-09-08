"use client"

import { Product } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import PriceTag from "./PriceTag"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { toggleLike } from "@/redux/features/productsSlice"

interface ProductCardProps {
  product: Product & { liked: boolean };
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew = 
    Date.now() - new Date(product.createdAt).getTime() < 
    1000 * 60 * 60 * 24 * 7

  const dispatch = useDispatch<AppDispatch>()

  const likeButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(toggleLike(product.id))
  }

  return (
    <Link
      href={"/products/" + product.id}
      className="card w-full bg-base-100 hover:shadow-xl transition-shadow"
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-64 object-cover"
        />
        <button
          className="absolute top-3 right-3 btn btn-ghost btn-circle"
          onClick={likeButtonClickHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill={product.liked ? "#bc56ef" : "none"}
            viewBox="0 0 24 24"
            stroke="#bc56ef"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round" 
              strokeWidth="1" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        {isNew && <div className="badge badge-secondary">NEW</div>}
        <p>{product.description}</p>
        <PriceTag price={product.price} />
      </div>
    </Link>
  )
}
