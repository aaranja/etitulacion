# Generated by Django 3.2.8 on 2022-01-14 10:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ARPGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gen_date', models.DateTimeField()),
                ('confirmed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ARPProcessPerson',
            fields=[
                ('id_card', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('full_name', models.CharField(blank=True, max_length=254)),
                ('profession', models.CharField(blank=True, max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='ARPData',
            fields=[
                ('record_page', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('institute', models.CharField(blank=True, max_length=254)),
                ('project_name', models.CharField(blank=True, max_length=254)),
                ('int_assessor_name', models.CharField(blank=True, max_length=254)),
                ('arp_group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='arp_group', to='users.arpgroup')),
                ('graduate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='graduate', to='users.graduateprofile')),
                ('president', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='president', to='users.arpprocessperson')),
                ('secretary', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='secretary', to='users.arpprocessperson')),
                ('vocal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vocal', to='users.arpprocessperson')),
            ],
        ),
    ]
