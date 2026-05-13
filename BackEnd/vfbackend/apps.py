from django.apps import AppConfig


class VfbackendConfig(AppConfig):

    default_auto_field = 'django.db.models.BigAutoField'

    name = 'vfbackend'

    def ready(self):

        import vfbackend.models