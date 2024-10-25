import os


class ImageReader:
    def __init__(self, directory):
        self.directory = directory

    def get_image_paths(self):
        supported_extensions = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
        image_paths = []
        try:
            for file_name in os.listdir(self.directory):
                if file_name.lower().endswith(supported_extensions):
                    full_path = os.path.normpath(
                        os.path.join(self.directory, file_name)
                    )
                    image_paths.append(str(full_path).replace("\\", "/"))
        except FileNotFoundError:
            print(f"Erro: O diretório '{self.directory}' não foi encontrado.")
        return image_paths


if __name__ == "__main__":
    image_dir = "./img"
    reader = ImageReader(image_dir)
    image_paths = reader.get_image_paths()
    print(image_paths)
