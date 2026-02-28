import codecs

with codecs.open(r'f:\UNICEF-AILSG\PWMU report\PWMUapp2\src\pages\Reporting\PWMUHub.jsx', 'r', 'utf-8') as f:
    text = f.read()

s_notifs = text.find('{/* Notifications & Action Items */}')
e_notifs = text.find('{/* Submission Calendar */}')
notifs = text[s_notifs:e_notifs]

s_cal = text.find('{/* Submission Calendar */}')
e_cal = text.find('{/* Right Column: KPIs & History (1/3 width) */}')
cal = text[s_cal:e_cal].rstrip()
cal = cal[:cal.rfind('</div>') + 6]

s_kpis = text.find('{/* Weekly Performance KPIs */}')
e_kpis = text.find('{/* Recent History / Approvals */}')
kpis = text[s_kpis:e_kpis]

s_hist = text.find('{/* Recent History / Approvals */}')
hist = text[s_hist:].strip()
export_idx = hist.find('export default')
if export_idx != -1:
    hist = hist[:export_idx]

# Remove the trailing 4 closing divs of the wrapper
for _ in range(4):
    hist = hist[:hist.rfind('</div>')]
hist = hist + '</div>\n'

new_grid = """                {/* ROW 1: Calendar & KPIs */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        """ + cal.strip() + """
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        """ + kpis.strip() + """
                    </div>
                </div>
            </div>

            {/* ROW 2: Action Center & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        """ + notifs.strip() + """
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        """ + hist.strip() + """
                    </div>
                </div>"""

start_idx = text.find('                {/* Left Column:')
end_idx = text.rfind('        </div>', 0, text.find('export default'))

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end index.", start_idx, end_idx)
else:
    new_text = text[:start_idx] + new_grid + "\n" + text[end_idx:]
    with codecs.open(r'f:\UNICEF-AILSG\PWMU report\PWMUapp2\src\pages\Reporting\PWMUHub.jsx', 'w', 'utf-8') as f:
        f.write(new_text)
    print('Success')
