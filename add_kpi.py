import re
import codecs

with codecs.open(r'f:\UNICEF-AILSG\PWMU report\PWMUapp2\src\pages\Reporting\PWMUHub.jsx', 'r', 'utf-8') as f:
    text = f.read()

new_kpi = '''
                                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Total Secondary Transport</p>
                                        <h4 className="text-2xl font-bold text-orange-700">450 <span className="text-sm font-medium text-gray-500">kg</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Resource Recovery Rate</p>
                                        <h4 className="text-2xl font-bold text-purple-700">76% <span className="text-xs text-purple-600 ml-1">↑ 2%</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <Factory className="w-5 h-5" />
                                    </div>
                                </div>
'''

pattern = r'(<p className="text-xs text-gray-500 font-medium mb-1">Active Reporting Rate</p>.*?<Users className="w-5 h-5" />\s*</div>\s*</div>)'

if re.search(pattern, text, re.DOTALL):
    text = re.sub(pattern, r'\g<1>' + new_kpi, text, flags=re.DOTALL)
    with codecs.open(r'f:\UNICEF-AILSG\PWMU report\PWMUapp2\src\pages\Reporting\PWMUHub.jsx', 'w', 'utf-8') as f:
        f.write(text)
    print("SUCCESS")
else:
    print("NOT FOUND")
