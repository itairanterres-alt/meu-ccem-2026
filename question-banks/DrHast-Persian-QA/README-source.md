---
task_categories:
- question-answering
language:
- fa
tags:
- medical
size_categories:
- 1M<n<10M
---

# Medical Question and Answering Dataset

Crawled from https://drhast.com.

Also available at https://huggingface.co/datasets/AliMoameri/drhast-persian-medical-QA.

# Dataset Structure
```json
{
        "title": "پایین امدن دیابت بارداری و ادامه دادن قرص گلوکوفاژ؟",
        "url": "https://drhast.com/q/yLvD6",
        "text": "سلام من هفته ۳۳ بارداری هستم هفته ۳۱ ازمایش دادم تشخیص دیابت دادن ناشتا۹۳ یکساعت بعد خوردن محلول ۲۰۷ و دوساعت بعد۱۷۲ متخصص داخلی روزی دوتا گلوکوفاژ و یه سری محدودیتا تغذیه مشخص کردن دوکیلو وزن کم کردم و امروز مجدد ازمایش دادم قند ناشتا ۸۴ و دوساعت بعد صبحانه شده بود۹۶ من دسترسی به دکترندارم تا دوشنبه به نظرتون قرص گلوکوفاژ را ادامه بدم برا جنین ضرر نداره یا نیاز نیست؟",
        "answers": [
            {
                "name": "دکتر مریم السادات هاشمی",
                "info": "https://drhast.com/doctor/%D8%AF%DA%A9%D8%AA%D8%B1-%D9%85%D8%B1%DB%8C%D9%85-%D8%A7%D9%84%D8%B3%D8%A7%D8%AF%D8%A7%D8%AA-%D9%87%D8%A7%D8%B4%D9%85%DB%8C-%D8%AA%D9%87%D8%B1%D8%A7%D9%86/dr-12176/",
                "specialties": [
                    "متخصص زنان و زایمان"
                ],
                "varified": true,
                "text": "سلام عزیزم قندتون الان با دارو خوب هست اگر خودتون دستگاه چک قند در منزل دارید دارو یکی بخورید و روزانه ناشتا و دو ساعت بعد صبحانه رو چک کنید و بادداشت کنید به پزشک نشون بدید"
            },
            {
                "name": "دکتر مریم دادخواه",
                "info": "https://drhast.com/doctor/%D8%AF%DA%A9%D8%AA%D8%B1-%D9%85%D8%B1%DB%8C%D9%85-%D8%AF%D8%A7%D8%AF%D8%AE%D9%88%D8%A7%D9%87-%D8%AA%D9%87%D8%B1%D8%A7%D9%86/dr-26122/",
                "specialties": [
                    "جراح و متخصص زنان ، زایمان ونازایی"
                ],
                "varified": true,
                "text": "سلام فعلا دارو رو ادامه دهید تا قند روزهای آینده هم چک کنید"
            }
        ]
    },
```

# Load the dataset with `datasets`
```python
>> from datasets import load_dataset
>> dataset = load_dataset('AliMoameri/drhast-persian-medical-QA')
>> dataset["train"][5]
{'title': 'لکه های تیره روی زبانم دراثرچیه؟',
 'url': 'https://drhast.com/q/zpvDe',
 'text': 'حدودیکساله روی زبونم لکه های تیره ایجادشده مدتیه خیلی بیشترشده دراثرچیه وبایدچیکارکنم؟',
 'answers': []}
```

