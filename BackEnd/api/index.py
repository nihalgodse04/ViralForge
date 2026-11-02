import os
import sys
from django.core.wsgi import get_wsgi_application

# Add the root directory to the python path so config can be found
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Vercel looks for an object named 'app'
app = get_wsgi_application()
