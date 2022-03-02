from OMPython import OMCSessionZMQ
import json
omc = OMCSessionZMQ()
omc.sendExpression("loadModel(Modelica)")
def GetParametersList(modelName):
	#->[ [typeA,nameA,annoA]...]
	try:
		componentsTuple = omc.sendExpression("getComponents(%s)"%modelName)
	except:
		return []
	else:
		parametersList = []
		for com in componentsTuple:
		# get one component's parameters
			if com[8]=='parameter':
				parametersList.append({"type":com[0],"name":com[1],"anno":com[2]})
		return parametersList


def GetConnectorsList(modelName):

	#->[ {typeA,nameA,annoA,pos}...]
	#need to do include placement
	connectorsList = []
	#connector could be a Component of model
	# print(modelName)
	try:
		_componentsTuple = omc.sendExpression("getComponents(%s)"%(modelName))
	except:
		return [] 
	_componentsAnnos = omc.sendExpression("getComponentAnnotations(%s)"%modelName)
	for th in range(1,len(_componentsTuple)+1):
		com = _componentsTuple[th-1]
		# print(th,com)
		comClass = com[0]
		# print(comName)
		comType = omc.sendExpression("getClassRestriction(%s)"%(comClass))
		if(comType == 'connector'):
			# print(comClass)
			# print(omc.sendExpression("getComponentAnnotations(%s)"%(modelName)))
			#((True, '-', '-', -110.0, -10.0, -90.0, 10.0, '-', '-', '-', '-', '-', '-', '-'),)
			# annoTuple = omc.sendExpression("getNthComponentAnnotation(%s,%d)"%(modelName,th))
			# annoTuple like ('placement',(True, '-', '-', -110.0, -10.0, -90.0, 10.0, '-', '-', '-', '-', '-', '-', '-'))
			annoTuple = _componentsAnnos[th-1]

			# print(th,annoTuple)
			posX = posY = 0
			if len(annoTuple)!=0 and annoTuple[0]=='Placement':
				
				annoTuple = annoTuple[1]
				posX = (annoTuple[3]+annoTuple[5])/200
				posY = (annoTuple[4]+annoTuple[6])/200
				# print(comClass,posX/100,posY/100)
			else:
				#getNthComponentAnnotation 方法不适用
				print("warning:%s's %s can't get right position"%(modelName,comClass))

			connectorsList.append({"class":comClass,"name":com[1],"anno":com[2],"pos":(posX,posY)})


	#connector could include in  Inheritance class
	_inheritanceCount = omc.sendExpression("getInheritanceCount(%s)"%modelName)
	for th in range(1,_inheritanceCount+1):
		comName = omc.sendExpression("getNthInheritedClass(%s,%d)"%(modelName,th))
		comType = omc.sendExpression("getClassRestriction(%s)"%(comName))
		#supposed to recursive queries Component(type == model)
		if(comType == 'model'):
			childAns = GetConnectorsList(comName)
			for ans_ in childAns:
				connectorsList.append(ans_)		
	return connectorsList

def GetAllModel(packageNmae):
	li = omc.sendExpression("getClassNames(%s)"%packageNmae)
	childList = []
	for child in li:
		childName = packageNmae+"."+child
		print("@"*len(packageNmae.split(".")),childName)
		childType = omc.sendExpression("getClassRestriction(%s)"%childName)
		if childType == "package":
			childList.append(GetAllModel(childName))
		if childType == "model":
			# print(GetParametersList(childName))
			# print(GetConnectorsList(childName))
			# print(childName)
			modelInfo = {"type":"model","name":childName,"parameters":GetParametersList(childName),"connectors":GetConnectorsList(childName)}
			print(modelInfo)
			childList.append(modelInfo)
	return {"name":packageNmae,"child":childList}

		

#problem mo's coneenct can't get correct position
mo = "Modelica.Electrical.Analog.Basic.M_Transformer"
# print(omc.sendExpression("getComponentAnnotations(%s)"%mo))
data = GetAllModel("Modelica.Electrical.Analog")
dataJson = json.dumps(data)
print(dataJson)
# m2 = "Modelica.Electrical.Analog.Lines.OLine"
# GetParametersList(m2)