import shortuuid


def usually_unique(prepend: str = "none_") -> str:
    uuid = shortuuid.uuid(name="syncm8.com")
    return prepend + str(uuid)[:7]
