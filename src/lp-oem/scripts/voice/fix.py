import re
REP=[("素押し","すおし"),("ไทย","タイ語"),("●●●●","伏せ字"),("／","、"),("（例）","の例"),("CR-TT-BK-M","シーアール、ティーティー、ビーケー、エム")]
def fix(t):
    for a,b in REP: t=t.replace(a,b)
    t=re.sub(r"（([^）]{0,40})）",r"、\1、",t)   # かっこは区切りとして読む
    t=re.sub(r"、\s*、",'、',t).replace("、。","。")
    return t
def sents(t):
    return [s.strip() for s in re.split(r"(?<=[。！？])",t) if s.strip(" 。、")]
