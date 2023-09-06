"use client"

import ProductCard from "@/components/ProductCard"
import Image from "next/image"
import Link from "next/link"
import { fetchProducts } from "@/redux/features/productsSlice"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useEffect } from "react"
import LoadingPage from "./loading"
import ErrorPage from "./error"

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useAppSelector(state => state.productsReducer.products)
  const isLoading = useAppSelector(state => state.productsReducer.isLoading)
  const error = useAppSelector(state => state.productsReducer.error)

  useEffect(() => {
    if (products.length == 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    console.error(error)
    return <ErrorPage />
  }

  return (
    <div>
      {products.length > 0 &&
        <div className="hero rounded-xl bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              src={products[0].imageUrl}
              alt={products[0].name}
              width={400}
              height={800}
              className="w-full max-w-sm rounded-lg shadow-2xl"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">{products[0].name}</h1>
              <p className="py-6">{products[0].description}</p>
              <Link
                href={"/products/" + products[0].id}
                className="btn btn-primary"
              >
                Check it out
              </Link>
            </div>
          </div>
        </div>
      }

      <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  )
}
