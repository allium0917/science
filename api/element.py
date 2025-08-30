from fastapi import APIRouter, Query
from service.element_service import search_elements, get_element_detail

router = APIRouter(prefix="/elements")

@router.get("/search")
def search(keyword: str = Query(...)):
    return search_elements(keyword)

@router.get("/{ename}")
def detail(ename: str):
    return get_element_detail(ename)
