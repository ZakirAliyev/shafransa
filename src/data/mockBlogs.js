export const MOCK_BLOGS = [
  {
    id: "mock-blog-1",
    author: "Shafransa Editorial",
    createdAt: "2026-06-10T00:00:00.000Z",
    images: ["/assets/zafaran.png"],
    videoUrl: "",
    category: "Science",
    translations: [
      {
        language: "az",
        category: "Elm",
        title: "Zəfəran: Uzunömürlülük və Psixi Aydınlığın Qızıl Eliksiri",
        description: `
          <p>Əsrlər boyu "Qızıl Ədviyyə" kimi tanınan Zəfəran (Crocus sativus) yalnız kulinariya incisi deyil, həm də ənənəvi təbabətin ən güclü terapevtik bitkilərindən biridir. Xüsusilə Abşeron zəfəranı qədim dövrlərdən bəri özünün yüksək keyfiyyəti və təsir gücü ilə tanınmışdır. Müasir fitoterapiya və kliniki tədqiqatlar bu qədim ədviyyənin beyin sağlamlığı, sinir hüceyrələrinin qorunması və psixi rifah üzərindəki fövqəladə təsirlərini yenidən kəşf edir.</p>

          <h3>Əsas Aktiv Fitokimyəvi Maddələr</h3>
          <p>Zəfəranın müalicəvi gücü onun tərkibindəki üç əsas bioaktiv birləşmədən qaynaqlanır:</p>
          <ul>
            <li><strong>Krosin (Crocin):</strong> Zəfərana parlaq qırmızı rəng verən və güclü antioksidant xüsusiyyətlərə malik su-həllolunan karotindir. Hüceyrələri sərbəst radikalların zədələrindən qoruyur və iltihabəleyhinə təsir göstərir.</li>
            <li><strong>Krosetin (Crocetin):</strong> Krosinin hidroliz məhsulu olan bu birləşmə qan-beyin baryerini asanlıqla keçərək birbaşa mərkəzi sinir sisteminə nüfuz edir və neyroprotektiv fəaliyyət göstərir.</li>
            <li><strong>Safranal:</strong> Zəfərana özünəməxsus ətir verən bu uçucu yağ neyrotransmitter səviyyələrini tənzimləyərək sakitləşdirici və antidepressant təsir yaradır.</li>
          </ul>

          <h3>Neyroloji Faydaları və Antidepressant Təsiri</h3>
          <p>Klinik araşdırmalar göstərir ki, gündəlik 30 mq zəfəran ekstraktı qəbulu, yüngül və orta dərəcəli depressiyanın müalicəsində geniş istifadə olunan sintetik SSRI (serotonin geri alım inhibitorları) preparatları ilə eyni dərəcədə effektivdir. Zəfəran beyində serotonin, dopamin və norepinefrin neyrotransmitterlərinin səviyyəsini təbii şəkildə artırır. Həmçinin beyində yeni sinir əlaqələrinin yaranmasını dəstəkləyən BDNF (Brain-Derived Neurotrophic Factor) zülalının sintezini stimullaşdırır.</p>

          <h3>Zəfəran Qəbulu və Dəmləmə Protokolu</h3>
          <p>Zəfəranın terapevtik təsirlərindən maksimum yararlanmaq üçün aşağıdakı protokol tövsiyə olunur:</p>
          <ol>
            <li><strong>Zəfəran Dəmləməsi:</strong> 3-5 ədəd təmiz zəfəran telini 80°C temperaturda olan (qaynar olmayan) yarım stəkan ilıq suya əlavə edin. Qapağını bağlayıb 15-20 dəqiqə dəmlənməsini gözləyin. Səhər tezdən acqarına və ya axşam yatmazdan 1 saat əvvəl içmək tövsiyə olunur.</li>
            <li><strong>Zəfəranlı Süd Eliksiri:</strong> İlıq badam südünə 3 tel zəfəran və bir az hil əlavə edib axşam qəbul edin. Bu, sinir sistemini sakitləşdirir və dərin yuxu fazasını uzadır.</li>
          </ol>

          <h3>Təhlükəsizlik və Doza Həddi</h3>
          <p>Terapevtik məqsədlər üçün gündəlik doza 15-30 mq arasındadır. Gündəlik 5 qramdan yuxarı zəfəran qəbulu toksik təsir göstərə bilər və hamiləlik zamanı uşaqlıq tonusunu artıraraq risk yarada biləcəyi üçün hamilə qadınlara yüksək dozada zəfəran qəbulu qətiyyən tövsiyə edilmir.</p>
        `
      },
      {
        language: "en",
        category: "Science",
        title: "Saffron: The Golden Elixir of Longevity and Mental Clarity",
        description: `
          <p>Renowned for centuries as the "Golden Spice," Saffron (Crocus sativus) is not only a culinary gem but also one of traditional medicine's most potent therapeutic plants. Particularly, Absheron saffron has been celebrated since ancient times for its exceptional purity and potency. Modern phytotherapy and clinical research are now validating what ancient sages knew: saffron possesses extraordinary properties for brain health, neuroprotection, and mental well-being.</p>

          <h3>Core Active Phytochemicals</h3>
          <p>Saffron's therapeutic efficacy stems from three primary bioactive compounds:</p>
          <ul>
            <li><strong>Crocin:</strong> The water-soluble carotenoid responsible for saffron's vibrant red hue. It acts as a powerful antioxidant, protecting cells from free-radical oxidative damage and reducing systemic inflammation.</li>
            <li><strong>Crocetin:</strong> The metabolic byproduct of crocin, this compound easily crosses the blood-brain barrier, exerting direct neuroprotective and anti-inflammatory actions on the central nervous system.</li>
            <li><strong>Safranal:</strong> The volatile oil that gives saffron its distinct aroma. Safranal regulates neurotransmitter activity, exerting anti-anxiety and antidepressant effects.</li>
          </ul>

          <h3>Neurological Benefits and Mood Support</h3>
          <p>Dozens of clinical trials demonstrate that 30mg of daily saffron extract is as effective as standard synthetic SSRIs (Selective Serotonin Reuptake Inhibitors) in managing mild-to-moderate depression. Saffron naturally enhances levels of serotonin, dopamine, and norepinephrine in the brain. Furthermore, it stimulates the synthesis of BDNF (Brain-Derived Neurotrophic Factor), a key protein responsible for neuroplasticity and the creation of new neural pathways.</p>

          <h3>Saffron Infusion and Preparation Protocol</h3>
          <p>To maximize the bioavailability of saffron's active constituents, follow this clinical preparation protocol:</p>
          <ol>
            <li><strong>Saffron Infusion:</strong> Add 3 to 5 high-grade saffron threads to half a cup of warm water (approximately 80°C, not boiling). Cover and let it steep for 15-20 minutes. Drink in the morning for cognitive focus, or 1 hour before bedtime to support deep restorative sleep.</li>
            <li><strong>Saffron Milk Elixir:</strong> Combine 3 saffron threads with a pinch of cardamom in warm almond milk. Let it steep for 10 minutes. This synergistic blend calms the nervous system and relaxes muscular tension.</li>
          </ol>

          <h3>Safety Guidelines and Dosage Cautions</h3>
          <p>The standard therapeutic daily dosage ranges from 15mg to 30mg. Consuming saffron in massive quantities (exceeding 5 grams per day) is toxic. Saffron is contraindicated in high therapeutic doses during pregnancy, as it can stimulate uterine contractions.</p>
        `
      },
      {
        language: "ru",
        category: "Наука",
        title: "Шафран: Золотой эликсир долголетия и ясности ума",
        description: `
          <p>Известный на протяжении веков как «золотая пряность», шафран (Crocus sativus) является не только кулинарным изыском, но и одним из самых мощных терапевтических растений традиционной медицины. Абшеронский шафран издавна ценился за свою чистоту и силу. Современная фитотерапия и клинические исследования подтверждают его влияние на когнитивные функции, защиту нейронов и психическое благополучие.</p>

          <h3>Основные активные фитонутриенты</h3>
          <p>Терапевтическая сила шафрана обусловлена тремя основными биоактивными соединениями:</p>
          <ul>
            <li><strong>Кроцин (Crocin):</strong> Водорастворимый каротиноид, придающий шафрану его цвет. Обладает мощными антиоксидантными свойствами, защищая клетки мозга от окислительного стресса.</li>
            <li><strong>Кроцетин (Crocetin):</strong> Легко преодолевает гематоэнцефалический барьер, оказывая прямое противовоспалительное действие на центральную нервную систему.</li>
            <li><strong>Сафранал (Safranal):</strong> Эфирное масло, определяющее аромат. Регулирует баланс нейромедиаторов, помогая снизить уровень тревоги и улучшить сон.</li>
          </ul>

          <h3>Клиническая эффективность при депрессии</h3>
          <p>Клинические испытания подтверждают, что ежедневный прием 30 мг экстракта шафрана сопоставим по эффективности со стандартными антидепрессантами из группы СИОЗС при легкой и умеренной депрессии. Шафран увеличивает доступность серотонина и дофамина в синапсах, а также повышает уровень нейротрофического фактора мозга (BDNF), стимулируя нейропластичность.</p>

          <h3>Протокол приготовления шафранового настоя</h3>
          <p>Для наилучшего высвобождения активных веществ рекомендуется следующий метод:</p>
          <ol>
            <li><strong>Настой на воде:</strong> Поместите 3-5 нитей шафрана в полстакана теплой воды (около 80°C). Накройте крышкой и настаивайте 15-20 минут. Принимайте утром для улучшения концентрации или вечером для глубокого сна.</li>
            <li><strong>Шафрановое молоко:</strong> Добавьте 3 нити шафрана и щепотку кардамона в теплое миндальное молоко. Дайте настояться 10 минут. Это средство снимает мышечное напряжение и успокаивает ум.</li>
          </ol>

          <h3>Безопасность и противопоказания</h3>
          <p>Безопасная терапевтическая доза составляет 15–30 мг в день. Дозы свыше 5 граммов в день токсичны. Большие дозы шафрана строго противопоказаны при беременности, так как они могут стимулировать сокращения матки.</p>
        `
      },
      {
        language: "tr",
        category: "Bilim",
        title: "Safran: Uzun Ömür ve Zihinsel Netliğin Altın İksiri",
        description: `
          <p>Yüzyıllardır "Altın Baharat" olarak anılan Safran (Crocus sativus), sadece lüks bir yemek malzemesi değil, aynı zamanda geleneksel tıbbın en güçlü terapötik bitkilerinden biridir. Özellikle Absheron safranı, antik çağlardan beri yüksek kalitesi ve etki gücüyle bilinir. Modern fitoterapi ve klinik araştırmalar, bu değerli bitkinin beyin sağlığı, sinir hücrelerinin korunması ve zihinsel dengelenme üzerindeki faydalarını kanıtlamaktadır.</p>

          <h3>Temel Aktif Bileşenler</h3>
          <p>Safranın şifalı özellikleri, yapısındaki üç ana biyoaktif bileşenden gelir:</p>
          <ul>
            <li><strong>Krosin (Crocin):</strong> Safrana parlak kırmızı rengini veren, suda çözünür güçlü bir antioksidandır. Hücreleri serbest radikallerin hasarından korur ve vücuttaki enflamasyonu azaltır.</li>
            <li><strong>Krosetin (Crocetin):</strong> Kan-beyin bariyerini doğrudan aşarak merkezi sinir sisteminde neyroprotektif (sinir koruyucu) etki gösterir.</li>
            <li><strong>Safranal:</strong> Safranın uçucu yağıdır. Beyindeki nörotransmitter dengesini düzenleyerek sakinleştirici, kaygı giderici ve uyku kalitesini artırıcı etki yaratır.</li>
          </ul>

          <h3>Nörolojik Faydaları ve Antidepresan Etkisi</h3>
          <p>Yapılan klinik çalışmalar, günlük 30 mg safran ekstresi kullanımının, hafif ve orta şiddetli depresyon tedavisinde klasik antidepresan ilaçlar (SSRI'lar) kadar etkili olduğunu ortaya koymuştur. Safran, beyinde serotonin, dopamin ve noradrenalin seviyelerini doğal yollarla dengeler ve yeni sinir hücresi bağlantılarının oluşmasını destekleyen BDNF proteinini aktive eder.</p>

          <h3>Safran Hazırlama ve Kullanım Protokolü</h3>
          <p>Safranın biyoaktif maddelerinden en yüksek verimi almak için şu protokol uygulanmalıdır:</p>
          <ol>
            <li><strong>Safran Demlemesi:</strong> 3-5 adet safran telini yaklaşık 80°C sıcaklıktaki (kaynar olmayan) yarım bardak suya ekleyin. Üzerini kapatıp 15-20 dakika demlenmeye bırakın. Sabahları odaklanma için veya akşamları uykudan önce tüketin.</li>
            <li><strong>Safranlı Süt İksiri:</strong> 3 tel safranı bir tutam kakule ile ılık badem sütüne ekleyin. 10 dakika beklettikten sonra için. Bu karışım sinir sistemini yatıştırır ve derin uyku fazını destekler.</li>
          </ol>

          <h3>Güvenlik ve Dozaj Sınırları</h3>
          <p>Terapötik amaçlı günlük güvenli doz 15-30 mg arasındadır. Günde 5 gramı aşan safran tüketimi toksik etki yaratabilir. Gebelik döneminde rahim kasılmalarını tetikleyebileceği için yüksek dozda safran tüketimi hamilelere kesinlikle önerilmez.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-2",
    author: "Shafransa Editorial",
    createdAt: "2026-06-09T00:00:00.000Z",
    images: ["/assets/nervous_system_herbs.png"],
    videoUrl: "",
    category: "Protocol",
    translations: [
      {
        language: "az",
        category: "Protokol",
        title: "Stres və Həyəcanın Bütüncül Tənzimlənməsi: Botanik Adaptogenlər",
        description: `
          <p>Müasir dünyada xroniki stres, bədənimizin homeostazını (daxili tarazlığını) pozan ən böyük amillərdən biridir. Həddindən artıq iş yükü, yuxusuzluq və stimullaşdırıcılar böyrəküstü vəzilərin həddindən artıq kortizol ifraz etməsinə səbəb olur. Bu yazıda sinir sistemini bitkilərlə necə sakitləşdirmək və stressə qarşı dözümlülüyü necə artırmaq yollarını araşdıracağıq.</p>

          <h3>HPA Oxu (Hipotalamus-Pituitar-Böyrəküstü Vəzilər Oxu)</h3>
          <p>Stres reaksiyası bədənimizdə HPA oxu vasitəsilə tənzimlənir. Xroniki stres zamanı bu ox daim aktiv qalır və nəticədə neyronların aşınması, immun sisteminin zəifləməsi və hormonal balansın pozulması baş verir. Botanik adaptogenlər məhz bu oxun fəaliyyətini modulyasiya edərək bədənin stresə qarşı dözümlülüyünü artırır.</p>

          <h3>Ən Effektiv Adaptogenlər və Sakitləşdirici Bitkilər</h3>
          <ul>
            <li><strong>Aşvaqanda (Ashwagandha - Withania somnifera):</strong> Kortizol səviyyələrini effektiv şəkildə azaldır, böyrəküstü vəziləri bərpa edir və yuxu keyfiyyətini yaxşılaşdırır. Beyində GABA (qamma-aminoyağ turşusu) reseptorlarının həssaslığını artırır.</li>
            <li><strong>Çobanyastığı (Matricaria chamomilla):</strong> Tərkibindəki bioaktiv apigenin maddəsi beyindəki benzodiazepine reseptorlarına bağlanaraq sinir gərginliyini və narahatlığı aradan qaldırır.</li>
            <li><strong>Limon Otu (Melissa officinalis):</strong> GABA transaminaz fermentini bloklayaraq beyindəki sakitləşdirici GABA transmitterinin səviyyəsini yüksəldir, eyni zamanda koqnitiv funksiyanı artırır.</li>
          </ul>

          <h3>Sinir Sistemini Sakitləşdirici Gündəlik Protokol</h3>
          <p>Gün ərzində HPA oxunu sakitləşdirmək üçün bu provokativ protokolu tətbiq edin:</p>
          <ol>
            <li><strong>Səhər (Kortizol Balansı):</strong> Səhər yeməyindən sonra 300 mq Aşvaqanda ekstraktı qəbul edin. Bu, günün ilk saatlarında stres reaksiyasının kəskinləşməsinin qarşısını alacaq.</li>
            <li><strong>Günorta (Sinir Gərginliyinin Azaldılması):</strong> Limon otu və nanə yarpaqlarının qarışığından hazırlanmış isti çay için. Bu, zehni aydınlığı qoruyaraq gərginliyi aradan qaldıracaq.</li>
            <li><strong>Axşam (Dərin Yuxuya Keçid):</strong> Yuxudan 2 saat əvvəl çobanyastığı və melisa çayı dəmləyin. Dəmləməyə 1 çay qaşığı bal əlavə edə bilərsiniz. Eyni zamanda 4-7-8 nəfəs texnikasını tətbiq etməklə parasimpatik sinir sisteminizi aktivləşdirin.</li>
          </ol>
        `
      },
      {
        language: "en",
        category: "Protocol",
        title: "Holistic Regulation of Stress and Anxiety: Botanical Adaptogens",
        description: `
          <p>In our modern high-paced society, chronic stress is one of the single greatest disruptors of physiological homeostasis. Overwork, sleep deprivation, and environmental stimuli lead to chronic overproduction of cortisol by the adrenal glands. This article explores how to therapeutically regulate the nervous system using botanical adaptogens to restore natural vitality and build stress resilience.</p>

          <h3>The HPA Axis (Hypothalamic-Pituitary-Adrenal Axis)</h3>
          <p>Our stress response is governed by the HPA axis. Under chronic stress, this feedback loop becomes dysfunctional, leading to constant sympathetic nervous system activation (fight-or-flight), cellular exhaustion, immune suppression, and hormonal imbalances. Botanical adaptogens work by molecularly modulating the receptors along this axis, preventing extreme cortisol spikes and restoring physiological equilibrium.</p>

          <h3>Key Adaptogens and Nervines</h3>
          <ul>
            <li><strong>Ashwagandha (Withania somnifera):</strong> Clinically proven to reduce serum cortisol levels, regenerate adrenal glands, and enhance sleep quality. It acts by modulating GABAergic pathways in the brain to reduce anxiety.</li>
            <li><strong>Chamomile (Matricaria chamomilla):</strong> Rich in the flavonoid apigenin, which binds directly to GABA-A (benzodiazepine) receptors in the brain, inducing mild sedation and mental calmness.</li>
            <li><strong>Lemon Balm (Melissa officinalis):</strong> Inhibits the enzyme GABA transaminase, effectively increasing GABA concentration in the brain, improving mood, and enhancing cognitive performance.</li>
          </ul>

          <h3>Clinical Nervous System Restoration Protocol</h3>
          <p>To systematically lower your allostatic load, implement the following daily schedule:</p>
          <ol>
            <li><strong>Morning (Cortisol Modulation):</strong> Take 300mg of standardized Ashwagandha extract with breakfast. This prevents early-morning cortisol surges and stabilizes energy levels.</li>
            <li><strong>Afternoon (Vagal Tone Support):</strong> Infuse a hot tea with Lemon Balm and Peppermint. Sip slowly, focusing on deep diaphragmatic breathing to stimulate the vagus nerve and reduce physical tension.</li>
            <li><strong>Evening (Parasympathetic Activation):</strong> Brew a concentrated infusion of chamomile flowers and lemon balm 2 hours before bed. Combine this with the 4-7-8 breathing technique to shift your body from sympathetic flight-or-flight into restorative parasympathetic rest.</li>
          </ol>
        `
      },
      {
        language: "ru",
        category: "Протоколы",
        title: "Целостная регуляция стресса и тревоги: Ботанические адаптогены",
        description: `
          <p>В современном мире хронический стресс является главным фактором, нарушающим гомеостаз организма. Высокие нагрузки и недосып приводят к избыточной секреции кортизола надпочечниками. В этой статье мы рассмотрим, как с помощью ботанических адаптогенов снизить уровень стресса и поддержать нервную систему.</p>

          <h3>Ось HPA (Гипоталамус-Гипофиз-Надпочечники)</h3>
          <p>Реакция на стресс регулируется осью HPA. При хроническом стрессе эта ось постоянно активна, что ведет к истощению клеток, снижению иммунитета и гормональному дисбалансу. Адаптогены мягко регулируют активность этой системы, возвращая организм в состояние баланса.</p>

          <h3>Основные адаптогены и успокаивающие травы</h3>
          <ul>
            <li><strong>Ашваганда (Withania somnifera):</strong> Снижает уровень кортизола, укрепляет надпочечники и улучшает качество сна. Увеличивает активность ГАМК-рецепторов в мозге.</li>
            <li><strong>Ромашка аптечная (Matricaria chamomilla):</strong> Содержит апигенин, который связывается с бензодиазепиновыми рецепторами мозга, уменьшая беспокойство.</li>
            <li><strong>Мелисса лекарственная (Melissa officinalis):</strong> Блокирует фермент, разрушающий ГАМК, повышая концентрацию этого успокаивающего нейромедиатора.</li>
          </ul>

          <h3>Ежедневный протокол восстановления нервной системы</h3>
          <ol>
            <li><strong>Утро (Баланс кортизола):</strong> Примите 300 мг экстракта Ашваганды во время завтрака. Это предотвратит резкие скачки кортизола.</li>
            <li><strong>День (Снятие напряжения):</strong> Выпейте чай с мелиссой и мятой для восстановления спокойствия и ментальной ясности.</li>
            <li><strong>Вечер (Глубокий отдых):</strong> За 2 часа до сна заварите крепкий чай из ромашки и мелиссы. Практикуйте дыхание 4-7-8 для активации парасимпатической системы.</li>
          </ol>
        `
      },
      {
        language: "tr",
        category: "Protokol",
        title: "Stres ve Kaygının Bütünsel Yönetimi: Botanik Adaptojenler",
        description: `
          <p>Modern yaşamın beraberinde getirdiği kronik stres, vücudumuzun iç dengesini (homeostaz) bozan en yaygın faktörlerden biridir. Yüksek iş temposu, uykusuzluk ve uyarıcı maddeler, böbrek üstü bezlerinin aşırı kortizol salgılamasına neden olur. Bu yazıda, adaptojen bitkiler vasıtasıyla sinir sistemini nasıl yatıştırabileceğimizi ele alacağız.</p>

          <h3>HPA Aksı (Hipotalamus-Hipofiz-Adrenal Aksı)</h3>
          <p>Vücudun stres tepkisi HPA aksı tarafından kontrol edilir. Kronik stres durumunda bu sistem sürekli uyarılır; bu da sinir hücrelerinin yıpranmasına, bağışıklık sisteminin çökmesine ve hormonal bozukluklara zemin hazırlar. Adaptojen bitkiler, bu aksı moleküler düzeyde dengeleyerek vücudun strese karşı direncini artırır.</p>

          <h3>En Güçlü Adaptojen ve Sinir Yatıştırıcı Bitkiler</h3>
          <ul>
            <li><strong>Ashwagandha (Withania somnifera):</strong> Kortizol seviyelerini düşürür, böbrek üstü bezlerini destekler ve uykuya geçişi kolaylaştırır. Beyindeki GABA reseptörlerini hassaslaştırır.</li>
            <li><strong>Papatya (Matricaria chamomilla):</strong> İçeriğindeki apigenin bileşeni sayesinde beyindeki sakinleştirici reseptörlere bağlanarak sinirsel gerginliği ve kaygıyı hafifletir.</li>
            <li><strong>Oğul Otu / Melisa (Melissa officinalis):</strong> Beyindeki yatıştırıcı kimyasal olan GABA'nın yıkımını önler, zihni sakinleştirirken odaklanmayı artırır.</li>
          </ul>

          <h3>Sinir Sistemini Dengeleyici Günlük Protokol</h3>
          <p>Gün içinde sinir sisteminizi sakinleştirmek için şu adımları izleyin:</p>
          <ol>
            <li><strong>Sabah (Kortizol Dengeleme):</strong> Sabah kahvaltısından sonra 300 mg Ashwagandha ekstresi tüketin. Bu, sabah saatlerindeki kortizol yükselmesini engeller.</li>
            <li><strong>Öğle (Zihinsel Rahatlama):</strong> Melisa ve nane yapraklarından oluşan sıcak bir çay hazırlayın. Yavaşça yudumlayarak vagus sinirini uyarmak için derin nefes alın.</li>
            <li><strong>Akşam (Parasempatik Aktivasyon):</strong> Uykudan 2 saat önce papatya ve melisa çayı demleyin. 4-7-8 nefes egzersizi ile birleştirerek vücudunuzu dinlenme moduna geçirin.</li>
          </ol>
        `
      }
    ]
  },
  {
    id: "mock-blog-3",
    author: "Shafransa Editorial",
    createdAt: "2026-06-08T00:00:00.000Z",
    images: ["/assets/gut_brain_axis.png"],
    videoUrl: "",
    category: "Protocol",
    translations: [
      {
        language: "az",
        category: "Protokol",
        title: "Bağırsaq-Beyin Oxu: Həzm Sistemi vasitəsilə Psixi Sağlamlığın Dəstəklənməsi",
        description: `
          <p>Son illərdə aparılan elmi araşdırmalar həzm sistema ilə beyin arasında birbaşa və sıx bir əlaqənin olduğunu sübut edir. Bağırsaq tez-tez "ikinci beyin" olaraq adlandırılır. Bu iki sistem arasındakı ikitərəfli əlaqə kanalı "Bağırsaq-Beyin Oxu" adlanır və psixi sağlamlığımıza birbaşa təsir göstərir.</p>

          <h3>Vaqus Siniri: İnformasiya Magistralı</h3>
          <p>Beyin ilə bağırsaq arasındakı fiziki əlaqənin əsasını Vaqus (azan) siniri təşkil edir. Bu sinir bağırsaq mikrobiomundan gələn siqnalları birbaşa beyin qabığına ötürür. Bağırsaqlarımızda yaşayan milyardlarla faydalı bakteriya serotonin (xoşbəxtlik hormonu) neyrotransmitterinin təxminən 90%-ni sintez edir. Buna görə də, bağırsaq mikrobiomunun pozulması birbaşa olaraq depressiya, həyəcan və beyin dumanına səbəb olur.</p>

          <h3>Həzmi və Psixi Sağlamlığı Dəstəkləyən Fitoterapevtik Maddələr</h3>
          <p>Mikrobiomu və həzm sistemini dəstəkləmək üçün bu bitki növlərindən istifadə tövsiyə olunur:</p>
          <ul>
            <li><strong>Acı Bitkilər (Gensian və Zəncirovotu kökü):</strong> Acı dad reseptorlarını aktivləşdirərək həzm fermentlərinin, öd ifrazının və mədə turşusunun ifrazını stimullaşdırır, bağırsaq divarlarını gücləndirir.</li>
            <li><strong>Zəncəfil (Zingiber officinale):</strong> Güclü iltihabəleyhinə təsirə malikdir. Mədə-bağırsaq traktının motorikasını sürətləndirir və vaqus sinirini stimullaşdırır.</li>
            <li><strong>Bəlğəmgətirici və Selikli Bitkilər (Bəlğəmotu və Qarağac qabığı):</strong> Həssas bağırsağın selikli qişasını qoruyur, iltihabı azaldır və sızan bağırsaq sindromunun qarşısını alır.</li>
          </ul>

          <h3>Həzm və Mikrobiom Bərpa Protokolu</h3>
          <p>Bağırsaq-beyin əlaqəsini optimallaşdırmaq üçün aşağıdakı protokola əməl edin:</p>
          <ol>
            <li><strong>Yeməkdən 15 dəqiqə əvvəl (Acı Tonik):</strong> Həzm fermentlərini stimullaşdırmaq üçün zəncirovotu və ya gensian kökü ekstraktı damcılarını su ilə qəbul edin.</li>
            <li><strong>Gün ərzində (Mikrobiom Qidası):</strong> Liflərlə zəngin qidalardan istifadə edin və hər gün zəncəfil dəmləməsi içərək həzm traktındakı iltihab proseslərini yatırın.</li>
            <li><strong>Axşam (Selikli Qişanın Qorunması):</strong> Yatmazdan əvvəl bəlğəmotu kökü tozu və su qarışığını içərək bağırsaq divarını qoruyan qat yaradın.</li>
          </ol>
        `
      },
      {
        language: "en",
        category: "Protocol",
        title: "The Gut-Brain Axis: Supporting Mental Health Through Digestive Wellness",
        description: `
          <p>Scientific discoveries over the last decade have conclusively demonstrated a deep, bi-directional relationship between the gastrointestinal tract and the central nervous system. Often referred to as the "second brain," the gut and its complex microbial ecosystem communicate continuously with the brain. This pathway, known as the Gut-Brain Axis, is a fundamental pillar of psychological and neurological health.</p>

          <h3>The Vagus Nerve: The Bidirectional Information Highway</h3>
          <p>The primary physical conduit of the gut-brain axis is the Vagus Nerve, which runs from the brainstem straight to the enteric nervous system of the gut. Interestingly, over 90% of the body's serotonin (the key neurotransmitter regulating mood and emotional stability) is synthesized by the gut microbiome, not the brain. Consequently, dysbiosis (imbalance in gut bacteria) and intestinal inflammation translate directly into systemic neuroinflammation, anxiety, depression, and cognitive decline.</p>

          <h3>Therapeutic Botanical Bitters and Mucilage</h3>
          <p>To clinical target the gut-brain axis, we utilize specific classes of botanicals:</p>
          <ul>
            <li><strong>Herbal Bitters (Gentian, Dandelion Root):</strong> Bitter compounds stimulate gustatory receptors, triggering a reflex that increases saliva, gastric acid, bile, and pancreatic enzyme secretion. This improves nutrient absorption and strengthens the intestinal barrier.</li>
            <li><strong>Ginger (Zingiber officinale):</strong> A powerful prokinetic agent that accelerates gastric emptying, dampens gut-specific inflammation, and directly stimulates vagal activity.</li>
            <li><strong>Demulcent Herbs (Marshmallow Root, Slippery Elm):</strong> Contain complex polysaccharides that form a soothing, protective gel over the mucosal lining, healing intestinal permeability ("leaky gut").</li>
          </ul>

          <h3>Digestive and Microbiome Restoration Protocol</h3>
          <p>To optimize your gut-brain signaling and enhance mood stability, follow this daily protocol:</p>
          <ol>
            <li><strong>Pre-Meal (15 Minutes Before):</strong> Take 20-30 drops of a Dandelion or Gentian bitter tonic in a small amount of water. This primes the digestive system for optimal chemical breakdown.</li>
            <li><strong>During the Day (Anti-inflammatory Support):</strong> Drink fresh ginger tea between meals. Gingerols stimulate intestinal motility and clear gut-related oxidative stress.</li>
            <li><strong>Night (Mucosal Healing):</strong> Consume a warm cup of Marshmallow Root cold-infusion before sleep. The mucilage coats and heals the digestive tract overnight, directly lowering morning anxiety.</li>
          </ol>
        `
      },
      {
        language: "ru",
        category: "Протоколы",
        title: "Ось кишечник-мозг: Поддержка психического здоровья через пищеварительную систему",
        description: `
          <p>Научные исследования последних лет подтверждают наличие тесной двусторонней связи между кишечником и головным мозгом. Кишечник часто называют «вторым мозгом». Путь общения между ними называется осью кишечник-мозг и напрямую определяет наше настроение и уровень энергии.</p>

          <h3>Блуждающий нерв и синтез серотонина</h3>
          <p>Физическую основу связи составляет блуждающий нерв (Vagus). Около 90% серотонина (гормона счастья) вырабатывается клетками кишечника при участии полезной микрофлоры. Дисбактериоз и воспаление в ЖКТ напрямую ведут к тревожности, депрессивным состояниям и «туману в голове».</p>

          <h3>Полезные травы и растительные горечи</h3>
          <ul>
            <li><strong>Растительные горечи (Корень одуванчика, горечавка):</strong> Стимулируют выработку желудочного сока и желчи, улучшая пищеварение.</li>
            <li><strong>Имбирь:</strong> Обладает противовоспалительным действием, улучшает перистальтику кишечника и активирует блуждающий нерв.</li>
            <li><strong>Алтей лекарственный:</strong> Создает защитный слой на слизистой оболочке ЖКТ, помогая при синдроме повышенной проницаемости кишечника.</li>
          </ul>

          <h3>Протокол восстановления оси кишечник-мозг</h3>
          <ol>
            <li><strong>За 15 минут до еды:</strong> Примите каплю настойки корня одуванчика или горечавки для стимуляции ферментов.</li>
            <li><strong>В течение дня:</strong> Пейте имбирный настой для снятия воспаления в кишечнике.</li>
            <li><strong>Перед сном:</strong> Выпейте настой корня алтея для заживления слизистой оболочки в ночное время.</li>
          </ol>
        `
      },
      {
        language: "tr",
        category: "Protokol",
        title: "Bağırsak-Beyin Aksı: Sindirim Sağlığı Yoluyla Zihinsel Esenliğin Desteklenmesi",
        description: `
          <p>Son yıllarda yapılan bilimsel araştırmalar, sindirim sistemi ile beyin arasında doğrudan ve güçlü bir etkileşim olduğunu kanıtlamıştır. Bağırsak, genellikle "ikinci beyin" olarak nitelendirilir. Bu iki sistem arasındaki çift yönlü iletişim kanalı olan Bağırsak-Beyin Aksı, ruh sağlığımızı ve bilişsel işlevlerimizi birebir etkiler.</p>

          <h3>Vagus Siniri: Bilgi İletişim Otobanı</h3>
          <p>Beyin ile bağırsak arasındaki fiziksel bağlantının temelini Vagus siniri oluşturur. Bağırsak mikrobiyotasında yaşayan trilyonlarca yararlı bakteri, vücuttaki serotonin (mutluluk hormonu) üretiminin yaklaşık %90'ını gerçekleştirir. Bu nedenle, bağırsak florasındaki bozulmalar doğrudan depresyon, kaygı bozukluğu ve konsantrasyon problemlerine yol açar.</p>

          <h3>Sindirim ve Zihin Sağlığını Destekleyen Tıbbi Bitkiler</h3>
          <p>Mikrobiyetayı ve sindirim sistemini korumak için şu bitki gruplarından yararlanılması önerilir:</p>
          <ul>
            <li><strong>Acı Bitkiler (Karahindiba ve Centiyane Kökü):</strong> Ağızdaki acı tat reseptörlerini uyararak mide asidi, safra ve sindirim enzimlerinin salgılanmasını başlatır, bağırsak bariyerini güçlendirir.</li>
            <li><strong>Zencefil (Zingiber officinale):</strong> Sindirim sistemi hareketliliğini hızlandırır, bağırsak içi iltihaplanmayı önler ve vagus sinirini uyarır.</li>
            <li><strong>Müsilaj İçeren Yumuşatıcı Bitkiler (Hatmi Kökü ve Karaağaç Kabuğu):</strong> Bağırsak çeperini koruyucu bir jel tabakasıyla kaplayarak "sızdıran bağırsak" sendromunun iyileşmesine yardımcı olur.</li>
          </ul>

          <h3>Sindirim ve Mikrobiyota Yenileme Protokolü</h3>
          <p>Bağırsak-beyin iletişiminizi optimize etmek için bu protokolü izleyin:</p>
          <ol>
            <li><strong>Yemeklerden 15 Dakika Önce (Acı Tonik):</strong> Sindirimi başlatmak için yarım çay bardağı suya karahindiba veya centiyane kökü damlası ekleyip için.</li>
            <li><strong>Gün İçinde (Enflamasyon Desteği):</strong> Yemek aralarında zencefil çayı tüketin. Bu, sindirim yolundaki ödemi azaltır.</li>
            <li><strong>Gece (Mukoza İyileştirme):</strong> Uykudan önce ılık hatmi kökü çayı tüketin. Jel kıvamındaki müsilaj, gece boyunca bağırsak duvarınızı onaracaktır.</li>
          </ol>
        `
      }
    ]
  },
  {
    id: "mock-blog-4",
    author: "Shafransa Editorial",
    createdAt: "2026-06-07T00:00:00.000Z",
    images: ["/assets/lavender_bergamot.png"],
    videoUrl: "",
    category: "Science",
    translations: [
      {
        language: "az",
        category: "Elm",
        title: "Terapevtik Aromaterapiya: Lavanda və Berqamotun Elmi Təsiri",
        description: `
          <p>Aromaterapiya sadəcə xoş qoxu yaymaq deyil, bitki mənşəli uçucu yağların sinir sisteminə təsir etdiyi elmi bir klinik metoddur. Lavanda və Berqamot efir yağları bu sahədə ən çox araşdırılan və sübut olunmuş sakitləşdirici vasitələrdir.</p>
          <h3>Lavanda və Linalool Maddəsi</h3>
          <p>Lavanda (Lavandula angustifolia) yağının tərkibində yüksək miqdarda linalool və linalil asetat maddələri var. Bu birləşmələr burundan tənəffüs edilərkən qoxu reseptorları vasitəsilə beyindəki limbik sistemi aktivləşdirir və ürək döyüntüsünü yavaşladaraq qan təzyiqini aşağı salır.</p>
          <h3>Berqamot və Limonen Təsiri</h3>
          <p>Berqamot (Citrus bergamia) qabığından əldə edilən yağ isə sinir gərginliyini aradan qaldırır və bədənin daxili tarazlığını bərpa edir. O, kortizol səviyyələrini azaldaraq emosional sakitliyə səbəb olur.</p>
          <h3>Tövsiyə Olunan Protokol</h3>
          <p>Otaqda difuzor vasitəsilə 3 damcı lavanda və 2 damcı berqamot yağı yayaraq axşam saatlarında 20 dəqiqə ərzində dərin nəfəs alın. Bu, yuxuya getməyi asanlaşdırır.</p>
        `
      },
      {
        language: "en",
        category: "Science",
        title: "Therapeutic Aromatherapy: The Science of Lavender and Bergamot",
        description: `
          <p>Aromatherapy is not just about pleasant fragrances; it is a clinical method where volatile organic compounds act directly on the central nervous system. Lavender and Bergamot essential oils are among the most thoroughly studied botanical extracts for neurological regulation.</p>
          <h3>Lavender and Linalool</h3>
          <p>Lavender (Lavandula angustifolia) contains high concentrations of linalool and linalyl acetate. When inhaled, these active constituents stimulate olfactory pathways that directly connect to the brain's limbic system, reducing heart rate and lowering blood pressure.</p>
          <h3>Bergamot and Limonene</h3>
          <p>Bergamot (Citrus bergamia) essential oil helps alleviate psychological stress and restores autonomic nervous system balance. It acts by reducing serum cortisol levels and inducing emotional balance.</p>
          <h3>Application Protocol</h3>
          <p>Diffuser recipe: Combine 3 drops of organic lavender and 2 drops of bergamot essential oil in a water diffuser. Run for 20 minutes in the evening before sleep while practicing deep inhalation.</p>
        `
      },
      {
        language: "ru",
        category: "Наука",
        title: "Терапевтическая ароматерапия: Наука о лаванде и бергамоте",
        description: `
          <p>Ароматерапия — это не просто приятные запахи, а клинический метод, основанный на действии летучих органических соединений на центральную нервную систему. Эфирные масла лаванды и бергамота являются наиболее изученными средствами для регуляции нервного напряжения.</p>
          <h3>Лаванда и линалоол</h3>
          <p>Масло лаванды содержит линалоол и линалилацетат. При вдыхании эти вещества стимулируют обонятельные рецепторы, связанные с лимбической системой мозга, замедляя сердечный ритм и снижая кровяное давление.</p>
          <h3>Бергамот и лимонен</h3>
          <p>Эфирное масло бергамота помогает снизить уровень кортизола и восстановить баланс вегетативной нервной системы при тревожных состояниях.</p>
          <h3>Рекомендуемый протокол</h3>
          <p>Добавьте 3 капли лаванды и 2 капли бергамота в диффузор. Используйте в течение 20 минут перед сном, практикуя глубокое дыхание.</p>
        `
      },
      {
        language: "tr",
        category: "Bilim",
        title: "Terapötik Aromaterapi: Lavanta ve Bergamotun Bilimsel Etkisi",
        description: `
          <p>Aromaterapi sadece hoş koku yaymaktan ibaret değildir; uçucu bitkisel bileşiklerin merkezi sinir sistemi üzerinde doğrudan etkili olduğu klinik bir yöntemdir. Lavanta ve Bergamot uçucu yağları, nörolojik dengeleme konusunda en çok araştırılan botanik özlerdir.</p>
          <h3>Lavanta ve Linalool</h3>
          <p>Lavanta (Lavandula angustifolia) yüksek oranda linalool ve linalil asetat içerir. Solunduğunda bu maddeler beynin limbik sistemini uyararak kalp atış hızını yavaşlatır ve kan basıncını düşürür.</p>
          <h3>Bergamot ve Limonen</h3>
          <p>Bergamot (Citrus bergamia) uçucu yağı, kortizol seviyelerini düşürerek sinirsel gerginliği azaltır ve otonom sinir sistemi dengesini yeniden tesis eder.</p>
          <h3>Kullanım Protokolü</h3>
          <p>Difüzör kullanımı: Su difüzörüne 3 damla lavanta ve 2 damla bergamot yağı ekleyin. Akşamları uykudan önce 20 dakika boyunca derin nefes alarak soluyun.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-5",
    author: "Shafransa Editorial",
    createdAt: "2026-06-06T00:00:00.000Z",
    images: ["/assets/anti_inflammatory_herbs.png"],
    videoUrl: "",
    category: "Protocol",
    translations: [
      {
        language: "az",
        category: "Protokol",
        title: "Xroniki İltihab: Müasir Xəstəliklərin Gizli Səbəbi və Botanik Həllər",
        description: `
          <p>Xroniki iltihab (iltihablanma) bir çox müasir xəstəliyin, o cümlədən ürək-damar xəstəliklərinin, diabetin və depressiyanın əsasında duran gizli faktordur. Təbii iltihabəleyhinə bitkilər bədənin hüceyrə səviyyəsində təmizlənməsinə kömək edir.</p>
          <h3>Sarıkök və Kurkumin Maddəsi</h3>
          <p>Sarıkökün (Curcuma longa) tərkibindəki kurkumin iltihaba səbəb olan NF-kB molekulunu bloklayır. Lakin kurkuminin bədən tərəfindən sorulmasını artırmaq üçün onu mütləq qara istiotla (piperin maddəsi ilə) birlikdə qəbul etmək lazımdır.</p>
          <h3>Zəncəfil və İltihab Tənzimlənməsi</h3>
          <p>Zəncəfil tərkibindəki gingerol maddəsi ilə bədəndəki iltihab yaradan sitokinlərin sintezini dayandırır və oynaq ağrılarını azaldır.</p>
          <h3>Qızıl Süd Protokolu</h3>
          <p>Yarım çay qaşığı sarıkök tozu, bir çimdik qara istiot və yarım çay qaşığı zəncəfili bir stəkan isti südə (badam və ya inək südü) əlavə edin. Qızdırın və hər axşam yatmazdan əvvəl isti şəkildə için.</p>
        `
      },
      {
        language: "en",
        category: "Protocol",
        title: "Chronic Inflammation: The Hidden Driver of Modern Diseases & Botanical Remedies",
        description: `
          <p>Chronic systemic inflammation is the underlying driver of most modern degenerative diseases, including cardiovascular issues, diabetes, and mood disorders. Botanical remedies offer a cellular-level down-regulation of inflammatory markers.</p>
          <h3>Turmeric and Curcumin</h3>
          <p>Turmeric (Curcuma longa) contains curcumin, a compound that directly blocks the cellular inflammatory pathway NF-kB. To enhance its systemic bioavailability, always pair turmeric with black pepper, which contains piperine.</p>
          <h3>Ginger and Inflammatory Cytokines</h3>
          <p>Gingerols found in Ginger inhibit the biosynthesis of inflammatory prostaglandins and leukotrienes, relieving systemic swelling and joint discomfort.</p>
          <h3>Golden Milk Protocol</h3>
          <p>Mix 1/2 tsp of organic turmeric powder, a pinch of black pepper, and 1/2 tsp of ground ginger in one cup of warm milk (almond or regular). Warm gently and drink nightly.</p>
        `
      },
      {
        language: "ru",
        category: "Протоколы",
        title: "Хроническое воспаление: Скрытый виновник болезней и растительные решения",
        description: `
          <p>Хроническое системное воспаление лежит в основе большинства современных заболеваний, от диабета до депрессии. Растительные противовоспалительные средства помогают снизить воспалительные маркеры на клеточном уровне.</p>
          <h3>Куркума и куркумин</h3>
          <p>Куркума содержит куркумин, который блокирует воспалительный путь NF-kB. Для улучшения усвоения куркумин обязательно нужно сочетать с пиперином (черным перцем).</p>
          <h3>Имбирь и противовоспалительное действие</h3>
          <p>Джинджеролы в имбире снижают синтез провоспалительных цитокинов и эффективно уменьшают суставные боли.</p>
          <h3>Протокол «Золотое молоко»</h3>
          <p>Смешайте 1/2 ч. ложки куркумы, щепотку черного перца и 1/2 ч. ложки имбиря в стакане теплого молока. Принимайте перед сном.</p>
        `
      },
      {
        language: "tr",
        category: "Protokol",
        title: "Kronik Enflamasyon: Modern Hastalıkların Gizli Nedeni ve Botanik Çözümler",
        description: `
          <p>Kronik enflamasyon (iltihaplanma), kardiyovasküler rahatsızlıklar, diyabet ve depresyon dahil olmak üzere pek çok modern hastalığın temelindeki gizli etkendir. Doğal anti-enflamatuar bitkiler hücresel düzeyde iyileşme sağlar.</p>
          <h3>Zerdeçal ve Kurkumin</h3>
          <p>Zerdeçalın (Curcuma longa) içindeki kurkumin, hücresel enflamasyon yolağı olan NF-kB'yi bloke eder. Kurkuminin emilimini artırmak için mutlaka karabiber (piperin) ile tüketilmelidir.</p>
          <h3>Zencefil ve Enflamasyon Dengesi</h3>
          <p>Zencefil, içerdiği gingerol sayesinde vücuttaki iltihap yapıcı sitokinlerin sentezini durdurur ve eklem ağrılarını hafifletir.</p>
          <h3>Altın Süt Protokolü</h3>
          <p>Yarım çay kaşığı toz zerdeçal, bir tutam karabiber ve yarım çay kaşığı toz zencefili bir bardak ılık süte (badem veya inek sütü) ekleyin. Isıtıp her akşam yatmadan önce tüketin.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-6",
    author: "Shafransa Editorial",
    createdAt: "2026-06-05T00:00:00.000Z",
    images: ["/assets/sleep_herbs.png"],
    videoUrl: "",
    category: "Protocol",
    translations: [
      {
        language: "az",
        category: "Protokol",
        title: "Yuxu Arxitekturası: Bitki mənşəli Melatonerjiklər",
        description: `
          <p>Yuxu keyfiyyəti hüceyrələrin yenilənməsi, yaddaşın möhkəmlənməsi və hormon tənzimlənməsi üçün vacibdir. Kimyəvi yuxu dərmanlarından fərqli olaraq, melatonerjik bitkilər təbii yuxu dövrlərini pozmadan dərin yuxunu dəstəkləyir.</p>
          <h3>Pişikotu Kökü və GABA Təsiri</h3>
          <p>Pişikotu kökü (Valeriana officinalis) beyindəki GABA səviyyələrini yüksəldərək sinir sistemini sakitləşdirir və dərin yuxu fazasını uzadır.</p>
          <h3>Mayaotu və Sakitləşdirici Təsir</h3>
          <p>Mayaotu (Humulus lupulus) bədən temperaturunu aşağı salır və təbii melatonin sintezini stimullaşdıraraq yuxuya getmə müddətini qısaldır.</p>
          <h3>Yuxu Protokolu</h3>
          <p>Yuxudan 1 saat əvvəl 1 çay qaşığı pişikotu kökü və yarım çay qaşığı mayaotunu 1 stəkan isti suda 15 dəqiqə dəmləyərək için. Yatdığınız otağın tam qaranlıq olmasına diqqət yetirin.</p>
        `
      },
      {
        language: "en",
        category: "Protocol",
        title: "Sleep Architecture: Herbal Melatonergics for Restorative Rest",
        description: `
          <p>High-quality sleep is crucial for cellular regeneration, memory consolidation, and hormonal balance. Unlike synthetic sedatives, melatonergic herbs support natural sleep cycles without causing morning grogginess.</p>
          <h3>Valerian Root and GABA Pathways</h3>
          <p>Valerian Root (Valeriana officinalis) increases GABA availability in the brain, slowing nervous activity and lengthening deep, restorative sleep stages.</p>
          <h3>Hops and Sleep Latency</h3>
          <p>Hops (Humulus lupulus) act synergistically with valerian to lower core body temperature and promote melatonin synthesis, reducing sleep latency.</p>
          <h3>Restorative Sleep Protocol</h3>
          <p>Infuse 1 tsp of dried Valerian Root and 1/2 tsp of Hops in hot water for 15 minutes. Drink 1 hour before bedtime in a dark, screen-free environment.</p>
        `
      },
      {
        language: "ru",
        category: "Протоколы",
        title: "Архитектура сна: Растительные мелатонергические средства",
        description: `
          <p>Качественный сон критически важен для восстановления клеток и гормонального баланса. Растительные средства поддерживают естественные фазы сна, не вызывая дневной сонливости.</p>
          <h3>Корень валерианы и ГАМК</h3>
          <p>Корень валерианы увеличивает концентрацию ГАМК в мозге, способствуя быстрому расслаблению и удлинению фазы глубокого сна.</p>
          <h3>Хмель и мелатонин</h3>
          <p>Соплодия хмеля помогают снизить температуру тела и стимулируют естественный синтез мелатонина.</p>
          <h3>Протокол улучшения сна</h3>
          <p>Заварите 1 ч. ложку корня валерианы и 1/2 ч. ложки хмеля в стакане горячей воды. Пейте за 1 час до сна в темной комнате.</p>
        `
      },
      {
        language: "tr",
        category: "Protokol",
        title: "Uyku Mimarisi: Bitkisel Melatonerjikler ve Derin Uyku",
        description: `
          <p>Kaliteli uyku, hücresel yenilenme, hafızanın pekiştirilmesi ve hormonal denge için hayati önem taşır. Sentetik uyku ilaçlarının aksine, melatonerjik bitkiler doğal uyku döngülerini bozmadan derin uykuyu destekler.</p>
          <h3>Kediotu Kökü ve GABA Etkisi</h3>
          <p>Kediotu kökü (Valeriana officinalis), beyindeki GABA seviyelerini artırarak sinir sistemini yatıştırır ve derin uyku süresini uzatır.</p>
          <h3>Şerbetçiotu ve Sakinleştirici Etki</h3>
          <p>Şerbetçiotu (Humulus lupulus), vücut sıcaklığını düşürür ve melatonin sentezini uyararak uykuya geçiş süresini kısaltır.</p>
          <h3>Uyku Protokolü</h3>
          <p>Uykudan 1 saat önce 1 çay kaşığı kediotu kökü ve yarım çay kaşığı şerbetçiotunu 1 bardak sıcak suda 15 dakika demleyerek için.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-7",
    author: "Shafransa Editorial",
    createdAt: "2026-06-04T00:00:00.000Z",
    images: ["/assets/nervous_system_herbs.png"],
    videoUrl: "",
    category: "Science",
    translations: [
      {
        language: "az",
        category: "Elm",
        title: "Böyrəküstü Vəzi Yorğunluğu: Rodiola və Reyhan (Tulsi)",
        description: `
          <p>Böyrəküstü vəzilərin həddindən artıq gərginləşməsi xroniki yorğunluq, hormonal disbalans və səhərlər oyanmaqda çətinlik yaradır. Rodiola və Tulsi bu ritmi bərpa etməyə kömək edir.</p>
          <h3>Rodiola (Qızıl Kök) və Koqnitiv Dözümlülük</h3>
          <p>Rodiola (Rhodiola rosea) idrak funksiyalarını gücləndirir və zehni yorğunluğu aradan qaldırır, bədənin fiziki dözümlülüyünü artırır.</p>
          <h3>Müqəddəs Reyhan (Tulsi) və Emosional Balans</h3>
          <p>Tulsi (Ocimum tenuiflorum) emosional gərginliyi azaldır, kortizol dalğalanmalarını tənzimləyir və immuniteti gücləndirir.</p>
          <h3>Bərpa Protokolu</h3>
          <p>Gündəlik olaraq səhərlər 200 mq Rodiola ekstraktı qəbul edin, günortadan sonra isə Tulsi çayı dəmləyərək stress səviyyənizi idarə edin.</p>
        `
      },
      {
        language: "en",
        category: "Science",
        title: "Adrenal Fatigue & Cortisol Rhythm: Rhodiola and Holy Basil (Tulsi)",
        description: `
          <p>Adrenal exhaustion leading to disrupted cortisol curves causes chronic fatigue, hormonal imbalance, and poor morning energy. Rhodiola and Holy Basil function to rebuild this natural circadian rhythm.</p>
          <h3>Rhodiola Rosea for Mental Endurance</h3>
          <p>Rhodiola rosea acts as a powerful adaptogen that enhances cellular energy production, increases focus, and reduces fatigue during high stress.</p>
          <h3>Holy Basil (Tulsi) for Cortisol Balance</h3>
          <p>Holy Basil (Ocimum tenuiflorum) has been shown to modulate systemic cortisol release, stabilizing mood and providing nervous support.</p>
          <h3>Adrenal Recovery Protocol</h3>
          <p>Take 200mg of Rhodiola rosea extract with breakfast. In the late afternoon, brew a cup of Holy Basil tea to manage the evening cortisol decline.</p>
        `
      },
      {
        language: "ru",
        category: "Наука",
        title: "Синдром уставших надпочечников: Родиола и Священный базилик (Туласи)",
        description: `
          <p>Истощение надпочечников нарушает суточные колебания кортизола, приводя к хронической усталости. Родиола и Туласи помогают вернуть надпочечникам их нормальную функцию.</p>
          <h3>Родиола розовая для выносливости</h3>
          <p>Родиола улучшает выработку энергии клетками мозга, повышает концентрацию внимания и снижает утомляемость.</p>
          <h3>Священный базилик (Туласи) для баланса кортизола</h3>
          <p>Туласи регулирует выброс кортизола при эмоциональном напряжении и поддерживает иммунную систему.</p>
          <h3>Протокол восстановления надпочечников</h3>
          <p>Принимайте 200 мг экстракта родиолы розовой утром. Во второй половине дня пейте теплый чай из священного базилика.</p>
        `
      },
      {
        language: "tr",
        category: "Bilim",
        title: "Adrenal Yorgunluk ve Kortizol Ritmi: Rodiola ve Kutsal Fesleğen (Tulsi)",
        description: `
          <p>Böbrek üstü bezlerinin aşırı uyarılması kronik yorgunluğa ve sabahları uyanmakta zorlanmaya yol açar. Rodiola ve Tulsi bitkileri bu ritmi yeniden düzenlemeye yardımcı olur.</p>
          <h3>Rodiola ve Zihinsel Dayanıklılık</h3>
          <p>Rodiola (Rhodiola rosea), hücresel enerji üretimini artırarak odaklanmayı kolaylaştırır ve zihinsel yorgunluğu azaltır.</p>
          <h3>Kutsal Fesleğen (Tulsi) ve Kortizol Dengesi</h3>
          <p>Tulsi (Ocimum tenuiflorum), kortizol dalgalanmalarını dengeleyerek duygusal dengeyi korur ve sinir sistemini destekler.</p>
          <h3>Adrenal Yenilenme Protokolü</h3>
          <p>Sabahları 200 mg Rodiola ekstresi tüketin, öğleden sonra ise stresi yönetmek için bir bardak Tulsi çayı demleyin.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-8",
    author: "Shafransa Editorial",
    createdAt: "2026-06-03T00:00:00.000Z",
    images: ["/assets/gut_brain_axis.png"],
    videoUrl: "",
    category: "Protocol",
    translations: [
      {
        language: "az",
        category: "Protokol",
        title: "Detoksifikasiya Yolları: Qaraciyərin Təbii Dəstəklənməsi",
        description: `
          <p>Bədənin əsas təmizləyici orqanı olan qaraciyər, toksinlərin zərərsizləşdirilməsi üçün 2 fazalı detoksifikasiya sistemindən istifadə edir. Süd qanqalı və acı köklər bu prosesdə əvəzolunmazdır.</p>
          <h3>Süd Qanqalı (Məryəm Noxudu) və Silimarin</h3>
          <p>Süd qanqalının (Silybum marianum) aktiv maddəsi olan silimarin qaraciyər hüceyrələrinin regenerasiyasını sürətləndirir və antioksidant müdafiəsini gücləndirir.</p>
          <h3>Zəncirovotu Kökü və Öd İfrazı</h3>
          <p>Zəncirovotu kökü öd istehsalını artıraraq qaraciyərdə yığılan toksinlərin bağırsaq vasitəsilə bədəndən xaric olunmasına kömək edir.</p>
          <h3>14 Günlük Təmizlənmə Protokolu</h3>
          <p>Hər gün yeməkdən əvvəl süd qanqalı ekstraktı qəbul edin və gün ərzində zəncirovotu kökü dəmləməsi için. Süni şəkər və spirtli içkilərdən uzaq durun.</p>
        `
      },
      {
        language: "en",
        category: "Protocol",
        title: "Detoxification Pathways: Supporting Liver Phase I and Phase II with Bitters",
        description: `
          <p>The liver utilizes a two-phase enzymatic process to neutralize and eliminate fat-soluble environmental toxins. Milk Thistle and bitter roots are crucial botanicals to assist these biological pathways.</p>
          <h3>Milk Thistle and Silymarin</h3>
          <p>Milk Thistle (Silybum marianum) contains silymarin, which clinically stimulates protein synthesis in hepatocytes to regenerate liver tissue and prevent toxin entry.</p>
          <h3>Dandelion Root and Bile Production</h3>
          <p>Dandelion Root stimulates bile flow, which carries neutralized toxins from the liver into the intestinal tract for final elimination.</p>
          <h3>14-Day Liver Support Protocol</h3>
          <p>Take a standardized Milk Thistle extract daily with meals, and drink Dandelion Root tea once per day to optimize hepatic detoxification pathways.</p>
        `
      },
      {
        language: "ru",
        category: "Протоколы",
        title: "Пути детоксикации: Поддержка печени с помощью растительных средств",
        description: `
          <p>Печень использует двухфазную систему очищения организма от токсинов. Расторопша и горькие корни стимулируют работу ферментов печени.</p>
          <h3>Расторопша и силимарин</h3>
          <p>Силимарин, активный компонент расторопши пятнистой, защищает клетки печени (гепатоциты), способствуя их быстрому обновлению.</p>
          <h3>Корень одуванчика и отток желчи</h3>
          <p>Корень одуванчика усиливает выработку и отток желчи, что облегчает выведение токсинов из организма.</p>
          <h3>14-дневный протокол очищения</h3>
          <p>Принимайте экстракт расторопши с едой и выпивайте один стакан отвара корня одуванчика в день.</p>
        `
      },
      {
        language: "tr",
        category: "Protokol",
        title: "Detoksifikasyon Yolları: Karaciğerin Bitkilerle Desteklenmesi",
        description: `
          <p>Vücudun ana temizlik organı olan karaciğer, toksinlerin zararsız hale getirilmesi için iki aşamalı bir detoks sistemi kullanır. Deve dikeni ve acı kökler bu süreçte kritik rol oynar.</p>
          <h3>Deve Dikeni ve Silimarin</h3>
          <p>Deve dikeninin (Silybum marianum) etken maddesi silimarin, karaciğer hücrelerinin yenilenmesini hızlandırır ve antioksidan koruma sağlar.</p>
          <h3>Karahindiba Kökü ve Safra Akışı</h3>
          <p>Karahindiba kökü, safra üretimini artırarak karaciğerde biriken atıkların sindirim yoluyla vücuttan atılmasına yardımcı olur.</p>
          <h3>14 Günlük Karaciğer Destek Protokolü</h3>
          <p>Günlük olarak deve dikeni ekstresi kullanın ve günde bir kez karahindiba kökü çayı tüketerek karaciğer detoksunu destekleyin.</p>
        `
      }
    ]
  },
  {
    id: "mock-blog-9",
    author: "Shafransa Editorial",
    createdAt: "2026-06-02T00:00:00.000Z",
    images: ["/assets/immune_resilience_herbs.png"],
    videoUrl: "",
    category: "Science",
    translations: [
      {
        language: "az",
        category: "Elm",
        title: "İmmunitet Davamlılığı: Mərcanotu (Mərcan giləmeyvəsi) və Astraqal",
        description: `
          <p>İmmunitet sistemini sadəcə stimullaşdırmaq deyil, onu immunomodulyasiya edərək daxili tarazlığı qorumaq vacibdir. Mərcanotu və Astraqal bu sahədə ən effektiv bitkilərdir.</p>
          <h3>Mərcanotu (Sambucus nigra) və Virus Əleyhinə Təsir</h3>
          <p>Mərcanotu tərkibindəki flavonoidlərlə virusların hüceyrələrə daxil olmasının qarşısını alır və xəstəlik müddətini qısaldır.</p>
          <h3>Astraqal (Astragalus membranaceus) və T-Hüceyrələrinin Aktivliyi</h3>
          <p>Astraqal bədəndəki T-hüceyrələrinin və makrofaqların fəaliyyətini gücləndirərək uzunmüddətli immun müdafiəsi yaradır.</p>
          <h3>İmmunitet Protokolu</h3>
          <p>Soyuq fəsillərdə gündəlik olaraq astraqal kökü çayı için, xəstəliyin ilk simptomları görünəndə isə mərcanotu şərbəti qəbul edin.</p>
        `
      },
      {
        language: "en",
        category: "Science",
        title: "Immune Resilience and Immunomodulation: Elderberry and Astragalus",
        description: `
          <p>Rather than merely stimulating the immune system, the clinical goal is immunomodulation—balancing immune cell pathways. Elderberry and Astragalus are key botanical agents for this task.</p>
          <h3>Elderberry (Sambucus nigra) and Viral Defense</h3>
          <p>Elderberry contains anthocyanins that bind directly to viral proteins, preventing their entry into host cells and accelerating recovery time.</p>
          <h3>Astragalus Membranaceus and Long-Term Immunity</h3>
          <p>Astragalus is a deep immune tonic that increases T-cell and macrophage production, building long-term adaptogenic immune defense.</p>
          <h3>Immune Support Protocol</h3>
          <p>Brew Astragalus root slices daily during high-exposure seasons. At the first sign of an acute viral symptom, take standardized Elderberry syrup.</p>
        `
      },
      {
        language: "ru",
        category: "Наука",
        title: "Иммунная устойчивость и иммуномодуляция: Бузина и Астрагал",
        description: `
          <p>Вместо простой стимуляции иммунитета клинический подход направлен на иммуномодуляцию. Бузина и астрагал являются ключевыми растениями для укрепления защитных сил организма.</p>
          <h3>Черная бузина (Sambucus nigra) и вирусы</h3>
          <p>Бузина богата антоцианами, препятствующими проникновению вирусов в клетки организма, что сокращает время течения простудных заболеваний.</p>
          <h3>Астрагал перепончатый для долгосрочного иммунитета</h3>
          <p>Астрагал стимулирует выработку Т-лимфоцитов и макрофагов, создавая надежную защиту от хронических инфекций.</p>
          <h3>Протокол поддержки иммунитета</h3>
          <p>Пейте отвар корня астрагала в простудный сезон, а при первых признаках простуды принимайте сироп бузины.</p>
        `
      },
      {
        language: "tr",
        category: "Bilim",
        title: "Bağışıklık Dayanıklılığı: Mürver ve Astragalus",
        description: `
          <p>Bağışıklık sistemini kontrolsüzce uyarmak yerine, onu dengelemek (immünomodülasyon) önemlidir. Mürver ve Astragalus bu dengede en etkili bitkilerdir.</p>
          <h3>Mürver (Sambucus nigra) ve Hücresel Savunma</h3>
          <p>Kara mürver, içerdiği antosiyaninler ile virüslerin hücre içine sızmasını engeller ve iyileşme süresini hızlandırır.</p>
          <h3>Astragalus ve T-Hücresi Aktivitesi</h3>
          <p>Astragalus kökü, T-hücrelerini ve makrofajları aktive ederek vücudun uzun vadeli bağışıklık direncini inşa eder.</p>
          <h3>Bağışıklık Protokolü</h3>
          <p>Mevsim geçişlerinde günlük olarak Astragalus kökü çayı tüketin, hastalık belirtileri başladığında ise standardize Mürver şurubu kullanın.</p>
        `
      }
    ]
  }
]
