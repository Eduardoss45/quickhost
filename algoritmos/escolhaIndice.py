def set_main_cover_image(main_cover_image, image_paths, accommodation):
    try:
        main_cover_image = int(main_cover_image)
    except (ValueError, TypeError):
        logger.info("main_cover_image não foi definido ou não é um número.")
        return
    temp_cover_image = None
    if main_cover_image is not None and isinstance(main_cover_image, int):
        if 0 <= main_cover_image < len(image_paths):
            temp_cover_image = image_paths[main_cover_image]
            logger.info(f"Imagem de capa principal definida como: {temp_cover_image}")
        else:
            logger.info(
                f"Valor inválido para main_cover_image: {main_cover_image}. Deixando vazio."
            )
    else:
        logger.info("main_cover_image não foi definido ou não é um número.")
    if temp_cover_image:
        attrs["main_cover_image"] = str(temp_cover_image)
        logger.info(
            f"main_cover_image agora armazenado como string: {attrs['main_cover_image']}"
        )
