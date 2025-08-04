import {useState,useEffect} from 'react'
import {useClient} from '@sanity/sdk-react'
export interface Category{_id:string;title:string;icon?:string}
const Q=`*[_type=="category"]|order(title asc){_id,title,icon}`
export function useCategories(){
  const c=useClient({apiVersion:'2025-07-15'})
  const[s,setS]=useState<Category[]>([])
  useEffect(()=>{c.fetch<Category[]>(Q).then(setS)},[c])
  return s
}
