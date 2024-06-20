from django.contrib import admin

from plans.models import PrivatePlan, Topic

# Register your models here.
admin.site.register(PrivatePlan)
admin.site.register(Topic)
