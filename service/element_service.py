from db.database import get_session
from db.models import Element
from sqlmodel import select

def search_elements(keyword: str):
    with get_session() as session:
        stmt = select(Element).where(
            (Element.ename.contains(keyword)) |
            (Element.symbol.contains(keyword))
        )
        return session.exec(stmt).all()

def get_element_detail(ename: str):
    with get_session() as session:
        return session.get(Element, ename)
