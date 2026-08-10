from __future__ import annotations

from fastapi.testclient import TestClient

from app.storage import StorageError

from tests.test_trabajos_create import api_client, create_work, image_files


def test_remove_image_rejects_leaving_zero_images(api_client: tuple[TestClient, dict]) -> None:
    client, _storage = api_client
    body = create_work(client, count=1)
    image_id = body["images"][0]["id"]

    res = client.delete(f"/api/trabajos/{body['id']}/imagenes/{image_id}")

    assert res.status_code == 422
    assert res.json()["detail"] == "a trabajo must keep at least one image"


def test_reorder_requires_exact_ids_and_persists_contiguous_order(api_client: tuple[TestClient, dict]) -> None:
    client, _storage = api_client
    body = create_work(client, count=3)
    reversed_ids = [image["id"] for image in reversed(body["images"])]

    res = client.put(f"/api/trabajos/{body['id']}/imagenes/reorder", json={"imageIds": reversed_ids})
    assert res.status_code == 200, res.text
    reordered = res.json()["images"]
    assert [image["id"] for image in reordered] == reversed_ids
    assert [image["sortOrder"] for image in reordered] == [0, 1, 2]

    missing = client.put(f"/api/trabajos/{body['id']}/imagenes/reorder", json={"imageIds": reversed_ids[:-1]})
    assert missing.status_code == 422


def test_set_cover_is_atomic_and_syncs_denormalized_fields(api_client: tuple[TestClient, dict]) -> None:
    client, _storage = api_client
    body = create_work(client, count=3)
    target = body["images"][2]

    res = client.put(f"/api/trabajos/{body['id']}/imagenes/{target['id']}/cover")
    assert res.status_code == 200, res.text
    updated = res.json()
    assert [image["isCover"] for image in updated["images"]].count(True) == 1
    assert updated["images"][2]["isCover"] is True
    assert updated["imageUrl"] == target["imageUrl"]
    assert updated["thumbnailUrl"] == target["thumbnailUrl"]


def test_add_images_and_replace_image_preserve_gallery_contract(api_client: tuple[TestClient, dict]) -> None:
    client, _storage = api_client
    body = create_work(client, count=1)

    added = client.post(
        f"/api/trabajos/{body['id']}/imagenes",
        data={"alt": "nueva", "aspect_ratio": "1 / 1"},
        files=image_files(2),
    )
    assert added.status_code == 200, added.text
    assert len(added.json()["images"]) == 3
    replacement_id = added.json()["images"][1]["id"]

    replaced = client.put(
        f"/api/trabajos/{body['id']}/imagenes/{replacement_id}/imagen",
        data={"alt": "reemplazada", "aspect_ratio": "16 / 9"},
        files=image_files(1),
    )
    assert replaced.status_code == 200, replaced.text
    image = next(item for item in replaced.json()["images"] if item["id"] == replacement_id)
    assert image["alt"] == "reemplazada"
    assert image["aspectRatio"] == "16 / 9"


def test_replace_image_rolls_back_cleanup_when_storage_fails(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    body = create_work(client, count=2)
    storage["fail_after_puts"] = len(storage["put"]) + 1
    target = body["images"][1]

    res = client.put(
        f"/api/trabajos/{body['id']}/imagenes/{target['id']}/imagen",
        files=image_files(1),
    )

    assert res.status_code == 502
    assert storage["delete"][-1:] == [f"trabajos/{body['id']}/{target['id']}/image.webp"]


def test_remove_non_cover_image_cleans_objects(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    body = create_work(client, count=2)
    target = body["images"][1]

    res = client.delete(f"/api/trabajos/{body['id']}/imagenes/{target['id']}")

    assert res.status_code == 204
    assert storage["delete"][-2:] == [
        f"trabajos/{body['id']}/{target['id']}/image.webp",
        f"trabajos/{body['id']}/{target['id']}/thumbnail.webp",
    ]
