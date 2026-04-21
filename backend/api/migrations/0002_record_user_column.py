from django.db import migrations


def add_user_column_if_missing(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(api_record)")
        columns = [row[1] for row in cursor.fetchall()]
        if 'user_id' not in columns:
            cursor.execute(
                'ALTER TABLE api_record ADD COLUMN user_id char(32) NULL '
                'REFERENCES "api_user" ("id") DEFERRABLE INITIALLY DEFERRED'
            )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_user_column_if_missing, migrations.RunPython.noop),
    ]
