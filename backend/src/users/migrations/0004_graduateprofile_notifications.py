# Generated by Django 3.2.6 on 2021-09-03 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_rename_type_user_account_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='graduateprofile',
            name='notifications',
            field=models.JSONField(blank=True, default=list),
        ),
    ]