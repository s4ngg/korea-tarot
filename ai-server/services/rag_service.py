import json
import os
import pickle
from pathlib import Path

import faiss
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536

_FAISS_INDEX_PATH = Path(os.getenv("FAISS_INDEX_PATH", "./faiss_index"))
_CARDS_DATA_PATH = Path("./data/tarot_cards.json")

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _get_embedding(text: str) -> list[float]:
    response = _client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


def _build_card_document(card: dict) -> str:
    return (
        f"카드명: {card['name']} ({card['name_kr']})\n"
        f"아르카나: {card['arcana_type']}\n"
        f"정방향 의미: {card['upright_meaning']}\n"
        f"역방향 의미: {card['reversed_meaning']}\n"
        f"상징: {card['symbols']}\n"
        f"설명: {card['description']}"
    )


def is_index_built() -> bool:
    return (
        (_FAISS_INDEX_PATH / "tarot.index").exists()
        and (_FAISS_INDEX_PATH / "metadata.pkl").exists()
    )


def build_and_save_index() -> int:
    with open(_CARDS_DATA_PATH, "r", encoding="utf-8") as f:
        cards: list[dict] = json.load(f)

    documents = [_build_card_document(card) for card in cards]
    embeddings = [_get_embedding(doc) for doc in documents]

    vectors = np.array(embeddings, dtype=np.float32)
    faiss.normalize_L2(vectors)

    index = faiss.IndexFlatIP(EMBEDDING_DIM)
    index.add(vectors)

    _FAISS_INDEX_PATH.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(_FAISS_INDEX_PATH / "tarot.index"))
    with open(_FAISS_INDEX_PATH / "metadata.pkl", "wb") as f:
        pickle.dump({"documents": documents, "cards": cards}, f)

    return len(cards)


def search_card_contexts(card_names: list[str]) -> list[str]:
    index = faiss.read_index(str(_FAISS_INDEX_PATH / "tarot.index"))
    with open(_FAISS_INDEX_PATH / "metadata.pkl", "rb") as f:
        metadata = pickle.load(f)
    documents: list[str] = metadata["documents"]

    contexts = []
    for name in card_names:
        query_vector = np.array([_get_embedding(name)], dtype=np.float32)
        faiss.normalize_L2(query_vector)
        _, indices = index.search(query_vector, 1)
        contexts.append(documents[int(indices[0][0])])

    return contexts
