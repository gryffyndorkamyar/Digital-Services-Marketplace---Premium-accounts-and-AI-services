from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0004_orderitem_content_orderitem_delivered_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='content',
            field=models.TextField(blank=True, help_text='اطلاعات یا توضیحاتی که باید به کاربر تحویل داده شود (اختیاری)', verbose_name='محتوای محصول'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='delivered_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='تاریخ تحویل'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='download_file',
            field=models.FileField(blank=True, null=True, upload_to='carts/files/', verbose_name='فایل دانلودی'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='download_url',
            field=models.URLField(blank=True, verbose_name='لینک دانلود'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='is_delivered',
            field=models.BooleanField(default=False, verbose_name='تحویل داده شده'),
        ),
        migrations.AddIndex(
            model_name='cartitem',
            index=models.Index(fields=['cart', 'is_delivered'], name='cart_carti_cart_id_dc3b32_idx'),
        ),
    ]

