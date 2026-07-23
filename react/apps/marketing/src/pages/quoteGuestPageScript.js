(function () {
  var dropZone = document.getElementById('drop-zone');
  var fileInput = document.getElementById('file-input');
  var statusArea = document.getElementById('status-area');
  var actions = document.getElementById('guest-login-actions');
  var title = document.querySelector('[data-status-title]');
  var detail = document.querySelector('[data-status-detail]');
  var percent = document.querySelector('[data-status-percent]');
  var needInput = document.getElementById('guest-need-input');
  var continueButton = document.getElementById('continue-workbench');
  var sendGuestMessage = document.getElementById('send-guest-message');
  var chatUploadTrigger = document.getElementById('chat-upload-trigger');
  var guestPanel = document.getElementById('guest-panel');
  var chatBoard = document.querySelector('[data-chat-board]');
  var quotaPill = document.querySelector('[data-quota-pill]');
  var quotaCopy = document.querySelector('[data-quota-copy]');
  var loginContinue = document.getElementById('login-continue');
  var registerContinue = document.getElementById('register-continue');
  var selectedFiles = [];
  var guestMessages = [];
  var guestMessageCount = 0;
  var guestLimit = 3;
  var currentMode = 'quickQuote';
  var modelFileTypes = ['step', 'stp', 'stl', 'iges', 'igs', 'obj', 'dwg', 'dxf', 'pdf'];
  var imageFileTypes = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  var drawingFileTypes = ['dwg', 'dxf', 'pdf', 'png', 'jpg', 'jpeg'];
  var workspaceTargets = {
    quote: './ai模型智能报价.html',
    text: './ai文字转模型.html',
    image: './ai图片转模型.html'
  };
  var modeConfigs = {
    quickQuote: {
      label: '快速报价',
      layout: 'upload',
      kicker: 'QUICK QUOTE',
      title: '上传资料，进入制造报价',
      description: '提交 3D 模型、2D 图纸或 PDF 资料后，可在登录后继续完善材料、数量、交期和表面处理要求。',
      points: ['多格式上传', '报价参数补充', '工作台续接'],
      cardTitle: '上传报价文件',
      cardDescription: '支持单个零件或多个工程文件，模型与图纸可一起提交。',
      badge: '快速报价入口',
      dropTitle: '拖拽文件到这里，或点击选择文件',
      dropDetail: '支持 .STEP、.STP、.STL、.IGES、.OBJ、.DWG、.DXF、.PDF，单文件建议不超过 100MB。',
      fileButton: '浏览文件',
      allowed: modelFileTypes,
      accept: '.step,.stp,.stl,.iges,.igs,.obj,.dwg,.dxf,.pdf',
      target: workspaceTargets.quote,
      choice: '工程资料仅用于报价评估；复杂项目、批量采购或无法上传模型时，可直接发起人工报价。',
      workflowTitle: '报价流程介绍',
      workflowDescription: '从资料提交到订单确认，先在当前页面完成轻量暂存，登录后进入工作台继续处理。',
      steps: [
        ['上传零件资料', '提交 3D 模型、2D 图纸、PDF 说明或关键加工要求。'],
        ['补充报价参数', '确认材料、数量、表面处理、公差重点和目标交期。'],
        ['工程评估报价', '进行 DFM 检查、工艺路径判断、成本拆分和风险提示。'],
        ['确认订单交付', '确认报价后进入生产排期、质检跟踪与交付协同。']
      ]
    },
    smartQuote: {
      label: '智能报价',
      layout: 'chat',
      kicker: 'AI QUOTE',
      title: '用模型和需求生成智能报价',
      description: '面向结构件、批量件和多工艺项目，先收集模型、图纸和关键报价需求。',
      points: ['模型识别', '需求对话', '报价拆分'],
      cardTitle: '和 AI 说明报价需求',
      cardDescription: '游客模式可先进行少量需求沟通；上传模型或进入估算时会转入工作台继续。',
      badge: '智能报价入口',
      chatPrompt: '今天想评估哪类零件报价？',
      chatWelcome: '一句话说清零件用途、材料、数量或交期即可；需要识别模型时可上传资料。',
      dropTitle: '上传模型、图纸或说明文件',
      dropDetail: '支持 STEP、STL、IGES、OBJ、DWG、DXF、PDF 等文件。',
      fileButton: '选择资料',
      allowed: modelFileTypes,
      accept: '.step,.stp,.stl,.iges,.igs,.obj,.dwg,.dxf,.pdf',
      target: workspaceTargets.quote,
      choice: '当前入口会把文件和需求一起带入智能报价工作台，登录后可继续补充工艺、材料和交期。',
      workflowTitle: '智能报价流程',
      workflowDescription: '先整理资料与需求，进入工作台后再完成模型识别、报价估算和订单动作。',
      steps: [
        ['输入需求', '上传模型、图纸，或用文字补充项目目标。'],
        ['确认参数', '补充材料、数量、表面处理和交期。'],
        ['生成报价', '工作台完成 AI 估算、风险提示和价格拆分。'],
        ['进入订单', '确认方案后进入下单、客服跟进或人工复核。']
      ]
    },
    rapidPrototype: {
      label: '快速原型',
      layout: 'chat',
      kicker: 'PROTOTYPE',
      title: '把原型需求带入评估工作台',
      description: '适合样件试制、小批量验证和结构迭代，先明确验证目标与制造约束。',
      points: ['样件试制', '工艺建议', '交期判断'],
      cardTitle: '和 AI 梳理原型需求',
      cardDescription: '先说明样件目标、材料方向和验证场景，上传资料后转入工作台继续评估。',
      badge: '快速原型入口',
      chatPrompt: '要先验证哪一个原型想法？',
      chatWelcome: '先描述样件用途、验证目标、数量和期望交期，资料可以稍后补充。',
      dropTitle: '上传模型或原型说明',
      dropDetail: '支持 3D 模型、2D 图纸、PDF 说明和图片资料。',
      fileButton: '选择资料',
      allowed: modelFileTypes.concat(imageFileTypes),
      accept: '.step,.stp,.stl,.iges,.igs,.obj,.dwg,.dxf,.pdf,.jpg,.jpeg,.png,.webp',
      target: workspaceTargets.quote,
      choice: '原型项目会带入智能报价工作台，登录后可继续确认材料、工艺和验证重点。',
      workflowTitle: '原型评估流程',
      workflowDescription: '先明确样件目标，再进入工作台完成制造路径与报价判断。',
      steps: [
        ['提交原型资料', '上传模型、图片、图纸或需求说明。'],
        ['说明验证目标', '补充外观、强度、装配或功能验证重点。'],
        ['选择制造路径', '根据数量、材料和交期判断加工或打印方式。'],
        ['输出原型方案', '形成可继续报价、下单或人工跟进的方案。']
      ]
    },
    dfm: {
      label: 'DFM检查',
      layout: 'chat',
      kicker: 'DFM REVIEW',
      title: '提交资料，检查制造可行性',
      description: '用于提前识别结构、材料、工艺和装配风险，减少后续返工。',
      points: ['结构检查', '工艺风险', '修改建议'],
      cardTitle: '和 AI 梳理 DFM 关注点',
      cardDescription: '先说明结构、加工或装配风险，上传模型后进入工作台继续完整检查。',
      badge: 'DFM 检查入口',
      chatPrompt: '你想先检查哪类制造风险？',
      chatWelcome: '可以先说明加工、装配、公差、薄壁或孔位风险，模型可作为附件补充。',
      dropTitle: '上传模型或图纸',
      dropDetail: '支持 STEP、STL、IGES、OBJ、DWG、DXF、PDF 等工程资料。',
      fileButton: '选择资料',
      allowed: modelFileTypes,
      accept: '.step,.stp,.stl,.iges,.igs,.obj,.dwg,.dxf,.pdf',
      target: workspaceTargets.quote,
      choice: 'DFM 资料会带入智能报价工作台，登录后继续查看制造风险、材料建议和成本影响。',
      workflowTitle: 'DFM 检查流程',
      workflowDescription: '先保存结构资料和关注点，登录后进入工作台做完整工程分析。',
      steps: [
        ['上传结构资料', '提交模型、图纸或关键尺寸说明。'],
        ['标记关注点', '说明公差、装配、薄壁、孔位或表面要求。'],
        ['工程检查', '识别加工风险、成本影响和返工可能。'],
        ['生成建议', '输出修改方向、工艺建议和后续报价路径。']
      ]
    },
    imageTo3d: {
      label: '图生3D模型',
      layout: 'chat',
      kicker: 'IMAGE TO 3D',
      title: '用图片开启 3D 模型生成',
      description: '从产品图片、草图或参考图开始，补充尺寸和结构目标后继续生成。',
      points: ['图片输入', '结构补充', '模型生成'],
      cardTitle: '和 AI 描述图片建模需求',
      cardDescription: '先说明图片来源、尺寸和结构目标，上传图片后进入图片转模型工作台。',
      badge: '图生 3D 入口',
      chatPrompt: '想把哪张参考图变成模型？',
      chatWelcome: '先说明图片里的产品、结构重点、尺寸参考和期望输出格式。',
      dropTitle: '上传参考图片或 PDF',
      dropDetail: '支持 JPG、PNG、WEBP、PDF，可在下方补充尺寸与结构描述。',
      fileButton: '选择图片',
      allowed: imageFileTypes,
      accept: '.jpg,.jpeg,.png,.webp,.pdf',
      target: workspaceTargets.image,
      choice: '图片会带入图片转模型工作台，登录后继续补充尺寸、视角和输出格式。',
      workflowTitle: '图生 3D 流程',
      workflowDescription: '先保留图片与文字说明，真正的模型生成在工作台完成。',
      steps: [
        ['上传参考图', '提交产品图片、草图、局部细节或 PDF。'],
        ['补充结构信息', '说明尺寸、材料、功能和关键比例。'],
        ['进入生成工作台', '登录后继续生成、调整和确认模型方向。'],
        ['输出模型资料', '导出可评估或可报价的模型文件。']
      ]
    },
    textTo3d: {
      label: '文生3D模型',
      layout: 'chat',
      kicker: 'TEXT TO 3D',
      title: '用文字描述开启模型生成',
      description: '用自然语言描述产品结构、功能、尺寸和外观目标，形成模型生成方向。',
      points: ['文字需求', '参数补充', '模型草案'],
      cardTitle: '描述模型需求',
      cardDescription: '可以不上传文件，先用文字说明产品结构、尺寸、材料、约束和输出目标。',
      badge: '文生 3D 入口',
      chatPrompt: '想生成什么样的 3D 模型？',
      chatWelcome: '直接描述结构、功能、尺寸、材质和应用场景即可，越具体越容易生成。',
      dropTitle: '可选上传参考图或说明文件',
      dropDetail: '支持 JPG、PNG、WEBP、PDF；也可以只在下方输入文字需求。',
      fileButton: '选择参考资料',
      allowed: imageFileTypes,
      accept: '.jpg,.jpeg,.png,.webp,.pdf',
      target: workspaceTargets.text,
      choice: '文字需求会带入文字转模型工作台，登录后继续生成模型、补充参数和确认输出格式。',
      workflowTitle: '文生 3D 流程',
      workflowDescription: '游客模式先记录简要需求，模型生成与版本迭代在工作台继续。',
      steps: [
        ['描述需求', '输入结构、功能、尺寸、材质或应用场景。'],
        ['补充参考', '可上传图片、PDF 或草图作为辅助资料。'],
        ['进入生成工作台', '登录后继续生成模型草案并调整参数。'],
        ['形成可评估模型', '输出可继续报价、评审或下载的模型资料。']
      ]
    },
    formatConvert: {
      label: '3D格式转换',
      layout: 'chat',
      kicker: 'FORMAT CONVERT',
      title: '上传模型，准备格式转换',
      description: '用于 STEP、STL、OBJ、IGES 等格式之间的转换，先确认源文件和目标格式。',
      points: ['格式识别', '转换目标', '文件续接'],
      cardTitle: '和 AI 确认格式转换需求',
      cardDescription: '先说明源格式、目标格式和使用软件，上传模型后进入工作台处理。',
      badge: '格式转换入口',
      chatPrompt: '要把模型转换成什么格式？',
      chatWelcome: '说明源格式、目标格式、单位和后续软件环境，模型可作为附件补充。',
      dropTitle: '上传 3D 模型文件',
      dropDetail: '支持 STEP、STP、STL、IGES、OBJ 等常见 3D 格式。',
      fileButton: '选择模型',
      allowed: ['step', 'stp', 'stl', 'iges', 'igs', 'obj'],
      accept: '.step,.stp,.stl,.iges,.igs,.obj',
      target: workspaceTargets.quote,
      choice: '转换需求会先暂存，登录后进入工作台确认目标格式并继续处理。',
      workflowTitle: '格式转换流程',
      workflowDescription: '先保存源文件和目标格式，登录后在工作台继续转换、确认和下载。',
      steps: [
        ['上传源模型', '提交需要转换的 3D 文件。'],
        ['选择目标格式', '说明目标格式、精度、单位或软件环境。'],
        ['进入工作台', '登录后继续转换并检查模型可用性。'],
        ['下载或报价', '获得转换结果后可继续报价或工程评估。']
      ]
    },
    threeToTwo: {
      label: '3D转2D工程图',
      layout: 'chat',
      kicker: '3D TO 2D',
      title: '由 3D 模型生成工程图',
      description: '由 3D 模型整理工程图要求，明确视图、标注、公差和输出格式。',
      points: ['模型输入', '图纸要求', '工程图输出'],
      cardTitle: '和 AI 确认工程图要求',
      cardDescription: '先说明视图、尺寸标注、公差和输出格式，上传模型后进入工作台生成。',
      badge: '工程图入口',
      chatPrompt: '需要生成哪类工程图？',
      chatWelcome: '先说明三视图、剖视、关键尺寸、公差或标题栏要求。',
      dropTitle: '上传待出图模型',
      dropDetail: '支持 STEP、STP、STL、IGES、OBJ，可补充 PDF 或说明。',
      fileButton: '选择模型',
      allowed: modelFileTypes,
      accept: '.step,.stp,.stl,.iges,.igs,.obj,.dwg,.dxf,.pdf',
      target: workspaceTargets.quote,
      choice: '工程图需求会带入工作台，登录后继续确认视图、标注和输出格式。',
      workflowTitle: '工程图生成流程',
      workflowDescription: '当前页面保存模型和出图要求，工作台承担视图生成与工程参数确认。',
      steps: [
        ['上传模型', '提交待转换的 3D 模型文件。'],
        ['补充出图要求', '说明三视图、剖视、尺寸、公差和标题栏。'],
        ['进入工作台', '登录后继续生成和检查工程图。'],
        ['输出图纸', '导出 DWG、DXF、PDF 或进入报价流程。']
      ]
    },
    bubble: {
      label: '2D气泡图标注',
      layout: 'chat',
      kicker: '2D BUBBLE',
      title: '提交图纸，生成气泡标注',
      description: '面向检验和质量协同，先确认编号规则、关键尺寸和图纸格式。',
      points: ['图纸输入', '编号规则', '质检协同'],
      cardTitle: '和 AI 确认气泡标注规则',
      cardDescription: '先说明编号规则、检验重点和图纸格式，上传图纸后进入工作台继续标注。',
      badge: '气泡图入口',
      chatPrompt: '这张图纸要怎样标注？',
      chatWelcome: '说明编号规则、检验项、关键尺寸和图纸格式即可。',
      dropTitle: '上传图纸或 PDF',
      dropDetail: '支持 DWG、DXF、PDF、JPG、PNG 等图纸和图片格式。',
      fileButton: '选择图纸',
      allowed: drawingFileTypes,
      accept: '.dwg,.dxf,.pdf,.jpg,.jpeg,.png',
      target: workspaceTargets.quote,
      choice: '标注资料会带入工作台，登录后继续确认编号规则、关键尺寸和检验项。',
      workflowTitle: '气泡图标注流程',
      workflowDescription: '先保存图纸和标注规则，登录后继续完成编号、检查项和质量文件协同。',
      steps: [
        ['上传图纸', '提交 DWG、DXF、PDF 或图片图纸。'],
        ['说明规则', '补充编号方式、检验项和关键尺寸。'],
        ['进入工作台', '登录后继续标注、检查和调整。'],
        ['输出质检资料', '生成可用于检验、采购或报价的标注结果。']
      ]
    }
  };

  /** English copy overlays — merged onto modeConfigs so module switching works in EN. */
  var modeCopyEn = {
    quickQuote: {
      label: 'Instant Quote',
      kicker: 'INSTANT QUOTE',
      title: 'Upload a model for a fast manufacturing quote',
      description: 'After you submit a 3D model, 2D drawing, or PDF package, continue with material, quantity, lead time, and finishing once signed in.',
      points: ['Multi-format upload', 'Initial DFM review', 'Manual quote available'],
      cardTitle: 'Upload quote files',
      cardDescription: 'Submit a single part or multiple engineering files — models and drawings together.',
      badge: 'Instant Quote',
      dropTitle: 'Drag files here, or click to browse',
      dropDetail: 'Supports .STEP, .STP, .STL, .IGES, .OBJ, .DWG, .DXF, .PDF. Prefer under 100MB per file.',
      fileButton: 'Browse files',
      choice: 'Engineering files are used for quote evaluation only. For complex, volume, or no-model cases, request a manual RFQ.',
      workflowTitle: 'How quoting works',
      workflowDescription: 'From file submit to order confirmation — lightly stage here, then continue in the workspace after login.',
      steps: [
        ['Upload part data', 'Submit 3D models, 2D drawings, PDF notes, or key machining requirements.'],
        ['Add quote params', 'Confirm material, quantity, finishing, critical tolerances, and target lead time.'],
        ['Engineering quote', 'Run DFM checks, process path judgment, cost breakdown, and risk notes.'],
        ['Confirm & deliver', 'After quote confirmation, move into scheduling, QC tracking, and delivery.']
      ],
      chatPrompt: 'What do you want to quote first?',
      chatWelcome: 'Describe the part, material, quantity, or lead time — or upload files to continue.',
      placeholderUpload: 'Add material, quantity, lead time, tolerance, or finishing notes...',
      placeholderChat: 'Describe needs, or tap + to upload files into the workspace...',
      continueUpload: 'Log in to workspace',
      continueChat: 'Open workspace',
      chatHintUpload: 'Upload files first, then log in to finish the quote.',
      chatHintChat: 'Chat through requirements first; upload or generation continues in the workspace.'
    },
    smartQuote: {
      label: 'Smart Quote',
      kicker: 'AI QUOTE',
      title: 'Build a smart quote from models and requirements',
      description: 'For structural parts, volume jobs, and multi-process projects — collect models, drawings, and key quote needs first.',
      points: ['Model recognition', 'Requirement chat', 'Cost breakdown'],
      cardTitle: 'Tell AI what you need quoted',
      cardDescription: 'Guest mode allows a few light chats; uploading a model or starting an estimate moves into the workspace.',
      badge: 'Smart Quote',
      chatPrompt: 'Which part should we quote first?',
      chatWelcome: 'Describe use, material, quantity, or lead time in one sentence; upload files when you need model recognition.',
      dropTitle: 'Upload models, drawings, or notes',
      dropDetail: 'Supports STEP, STL, IGES, OBJ, DWG, DXF, PDF, and similar files.',
      fileButton: 'Choose files',
      choice: 'Files and requirements move into the smart-quote workspace so you can refine process, material, and lead time after login.',
      workflowTitle: 'Smart quote flow',
      workflowDescription: 'Stage files and needs here, then finish model recognition, estimate, and order actions in the workspace.',
      steps: [
        ['Capture needs', 'Upload a model or drawing, or describe the project goal in text.'],
        ['Confirm params', 'Add material, quantity, finishing, and lead time.'],
        ['Generate quote', 'Workspace runs AI estimate, risk notes, and price breakdown.'],
        ['Move to order', 'Confirm the plan, then place an order or request human review.']
      ],
      placeholderChat: 'Describe quote needs, or tap + to upload files...',
      continueChat: 'Open workspace',
      chatHintChat: 'Clarify requirements first; uploads and estimates continue in the workspace.'
    },
    rapidPrototype: {
      label: 'Rapid Prototype',
      kicker: 'PROTOTYPE',
      title: 'Bring prototype needs into the evaluation workspace',
      description: 'For sample builds, low-volume validation, and design iteration — clarify validation goals and manufacturing constraints first.',
      points: ['Sample builds', 'Process advice', 'Lead-time check'],
      cardTitle: 'Outline prototype needs with AI',
      cardDescription: 'Describe sample goals, material direction, and validation scenarios; upload files to continue in the workspace.',
      badge: 'Rapid Prototype',
      chatPrompt: 'Which prototype idea should we validate first?',
      chatWelcome: 'Describe sample use, validation goals, quantity, and desired lead time — files can come later.',
      dropTitle: 'Upload a model or prototype brief',
      dropDetail: 'Supports 3D models, 2D drawings, PDF notes, and images.',
      fileButton: 'Choose files',
      choice: 'Prototype projects move into the smart-quote workspace so you can confirm material, process, and validation focus after login.',
      workflowTitle: 'Prototype evaluation flow',
      workflowDescription: 'Clarify sample goals here, then finish manufacturing path and quote judgment in the workspace.',
      steps: [
        ['Submit prototype data', 'Upload a model, image, drawing, or requirement note.'],
        ['State validation goals', 'Add appearance, strength, fit, or functional checks.'],
        ['Choose a path', 'Match quantity, material, and lead time to machining or printing.'],
        ['Deliver a plan', 'Produce a plan ready for quote, order, or human follow-up.']
      ],
      placeholderChat: 'Describe prototype goals, or tap + to upload files...',
      continueChat: 'Open workspace',
      chatHintChat: 'Clarify the prototype first; uploads continue in the workspace.'
    },
    dfm: {
      label: 'DFM Check',
      kicker: 'DFM REVIEW',
      title: 'Submit files to review manufacturability',
      description: 'Catch structure, material, process, and assembly risks early to reduce rework later.',
      points: ['Structure check', 'Process risk', 'Change advice'],
      cardTitle: 'Capture DFM focus with AI',
      cardDescription: 'Describe structure, machining, or assembly risks; upload a model to continue a full review in the workspace.',
      badge: 'DFM Check',
      chatPrompt: 'Which manufacturing risk should we check first?',
      chatWelcome: 'Call out machining, assembly, tolerance, thin-wall, or hole risks — attach a model when ready.',
      dropTitle: 'Upload a model or drawing',
      dropDetail: 'Supports STEP, STL, IGES, OBJ, DWG, DXF, PDF, and similar engineering files.',
      fileButton: 'Choose files',
      choice: 'DFM files move into the smart-quote workspace for manufacturing risk, material advice, and cost impact after login.',
      workflowTitle: 'DFM review flow',
      workflowDescription: 'Save structure data and focus areas here, then run full engineering analysis in the workspace.',
      steps: [
        ['Upload structure data', 'Submit a model, drawing, or critical dimension notes.'],
        ['Mark focus areas', 'Note tolerances, assembly, thin walls, holes, or surface needs.'],
        ['Engineering review', 'Identify machining risk, cost impact, and rework likelihood.'],
        ['Generate advice', 'Output change directions, process advice, and next quote steps.']
      ],
      placeholderChat: 'Describe DFM concerns, or tap + to upload files...',
      continueChat: 'Open workspace',
      chatHintChat: 'Capture risk focus first; full review continues in the workspace.'
    },
    imageTo3d: {
      label: 'Image to 3D',
      kicker: 'IMAGE TO 3D',
      title: 'Start 3D generation from an image',
      description: 'Begin from a product photo, sketch, or reference image, then add size and structure goals before generation.',
      points: ['Image input', 'Structure notes', 'Model generation'],
      cardTitle: 'Describe image-to-model needs with AI',
      cardDescription: 'Explain image source, size, and structure goals; upload images to continue in the image-to-3D workspace.',
      badge: 'Image to 3D',
      chatPrompt: 'Which reference image should become a model?',
      chatWelcome: 'Describe the product in the image, structure focus, size references, and desired output format.',
      dropTitle: 'Upload reference images or PDF',
      dropDetail: 'Supports JPG, PNG, WEBP, PDF — add size and structure notes below.',
      fileButton: 'Choose images',
      choice: 'Images move into the image-to-3D workspace so you can refine size, viewpoint, and output format after login.',
      workflowTitle: 'Image-to-3D flow',
      workflowDescription: 'Keep the image and notes here; actual model generation happens in the workspace.',
      steps: [
        ['Upload references', 'Submit product photos, sketches, detail shots, or PDF.'],
        ['Add structure notes', 'Explain size, material, function, and key proportions.'],
        ['Open generation workspace', 'Continue generating, adjusting, and confirming after login.'],
        ['Export model data', 'Download a model ready for evaluation or quoting.']
      ],
      placeholderChat: 'Describe image-to-3D goals, or tap + to upload images...',
      continueChat: 'Open workspace',
      chatHintChat: 'Describe the image goal first; generation continues in the workspace.'
    },
    textTo3d: {
      label: 'Text to 3D',
      kicker: 'TEXT TO 3D',
      title: 'Start model generation from a text brief',
      description: 'Describe structure, function, size, and appearance in natural language to shape a generation direction.',
      points: ['Text brief', 'Param notes', 'Model draft'],
      cardTitle: 'Describe the model you need',
      cardDescription: 'No file required — explain structure, size, material, constraints, and output goals in text.',
      badge: 'Text to 3D',
      chatPrompt: 'What 3D model should we generate?',
      chatWelcome: 'Describe structure, function, size, material, and use case — more detail yields better drafts.',
      dropTitle: 'Optional reference image or note',
      dropDetail: 'Supports JPG, PNG, WEBP, PDF — or text-only input below.',
      fileButton: 'Choose references',
      choice: 'Text briefs move into the text-to-3D workspace for generation, param tweaks, and output format after login.',
      workflowTitle: 'Text-to-3D flow',
      workflowDescription: 'Guest mode captures a light brief; generation and iteration continue in the workspace.',
      steps: [
        ['Describe needs', 'Enter structure, function, size, material, or use case.'],
        ['Add references', 'Optionally upload images, PDF, or sketches.'],
        ['Open generation workspace', 'Continue drafting and tuning after login.'],
        ['Produce an evaluable model', 'Export a model ready for quote, review, or download.']
      ],
      placeholderChat: 'Describe the model brief, or tap + to attach references...',
      continueChat: 'Open workspace',
      chatHintChat: 'Describe the model first; generation continues in the workspace.'
    },
    formatConvert: {
      label: '3D Format Convert',
      kicker: 'FORMAT CONVERT',
      title: 'Upload a model to prepare format conversion',
      description: 'Convert between STEP, STL, OBJ, IGES, and more — confirm source and target formats first.',
      points: ['Format detect', 'Target format', 'File handoff'],
      cardTitle: 'Confirm conversion needs with AI',
      cardDescription: 'State source format, target format, and software; upload the model to continue in the workspace.',
      badge: 'Format Convert',
      chatPrompt: 'Which format should the model become?',
      chatWelcome: 'State source format, target format, units, and downstream software — attach the model when ready.',
      dropTitle: 'Upload a 3D model file',
      dropDetail: 'Supports STEP, STP, STL, IGES, OBJ, and common 3D formats.',
      fileButton: 'Choose model',
      choice: 'Conversion requests are staged here, then finished in the workspace after login.',
      workflowTitle: 'Format conversion flow',
      workflowDescription: 'Save the source file and target format here, then convert, verify, and download in the workspace.',
      steps: [
        ['Upload source model', 'Submit the 3D file that needs conversion.'],
        ['Choose target format', 'State target format, precision, units, or software.'],
        ['Open workspace', 'Continue conversion and usability checks after login.'],
        ['Download or quote', 'Use the result for download, quote, or engineering review.']
      ],
      placeholderChat: 'Describe conversion needs, or tap + to upload a model...',
      continueChat: 'Open workspace',
      chatHintChat: 'Confirm formats first; conversion continues in the workspace.'
    },
    threeToTwo: {
      label: '3D to 2D Drawing',
      kicker: '3D TO 2D',
      title: 'Generate drawings from a 3D model',
      description: 'Capture drawing requirements from a 3D model — views, dimensions, tolerances, and output format.',
      points: ['Model input', 'Drawing rules', 'Drawing output'],
      cardTitle: 'Confirm drawing requirements with AI',
      cardDescription: 'State views, dimensions, tolerances, and output format; upload the model to generate in the workspace.',
      badge: '2D Drawing',
      chatPrompt: 'What kind of drawing do you need?',
      chatWelcome: 'Describe orthographic views, sections, critical dimensions, tolerances, or title-block needs.',
      dropTitle: 'Upload the model to draw from',
      dropDetail: 'Supports STEP, STP, STL, IGES, OBJ — PDF or notes optional.',
      fileButton: 'Choose model',
      choice: 'Drawing requests move into the workspace so you can confirm views, callouts, and output format after login.',
      workflowTitle: 'Drawing generation flow',
      workflowDescription: 'Save the model and drawing rules here; the workspace generates views and confirms engineering params.',
      steps: [
        ['Upload model', 'Submit the 3D model to convert.'],
        ['Add drawing rules', 'State views, sections, dimensions, tolerances, and title block.'],
        ['Open workspace', 'Continue generation and review after login.'],
        ['Export drawings', 'Export DWG, DXF, PDF, or move into quoting.']
      ],
      placeholderChat: 'Describe drawing needs, or tap + to upload a model...',
      continueChat: 'Open workspace',
      chatHintChat: 'Capture drawing rules first; generation continues in the workspace.'
    },
    bubble: {
      label: '2D Balloon Markup',
      kicker: '2D BUBBLE',
      title: 'Submit drawings for balloon markup',
      description: 'For inspection and quality collaboration — confirm numbering rules, critical dimensions, and drawing format first.',
      points: ['Drawing input', 'Numbering rules', 'QC handoff'],
      cardTitle: 'Confirm balloon rules with AI',
      cardDescription: 'State numbering rules, inspection focus, and drawing format; upload drawings to continue in the workspace.',
      badge: 'Balloon Markup',
      chatPrompt: 'How should this drawing be ballooned?',
      chatWelcome: 'Describe numbering rules, inspection items, critical dimensions, and drawing format.',
      dropTitle: 'Upload drawings or PDF',
      dropDetail: 'Supports DWG, DXF, PDF, JPG, PNG, and similar drawing formats.',
      fileButton: 'Choose drawings',
      choice: 'Markup files move into the workspace so you can confirm numbering, critical dimensions, and inspection items after login.',
      workflowTitle: 'Balloon markup flow',
      workflowDescription: 'Save drawings and markup rules here, then finish numbering, checks, and quality handoff in the workspace.',
      steps: [
        ['Upload drawings', 'Submit DWG, DXF, PDF, or image drawings.'],
        ['State rules', 'Add numbering method, inspection items, and critical dimensions.'],
        ['Open workspace', 'Continue markup, review, and adjustments after login.'],
        ['Export QC data', 'Produce markup ready for inspection, purchasing, or quoting.']
      ],
      placeholderChat: 'Describe balloon rules, or tap + to upload drawings...',
      continueChat: 'Open workspace',
      chatHintChat: 'Capture markup rules first; annotation continues in the workspace.'
    }
  };

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function getAppLang() {
    if (window.__ZHIZAO_LANG__ === 'en' || window.__ZHIZAO_LANG__ === 'zh') {
      return window.__ZHIZAO_LANG__;
    }
    try {
      var stored = window.localStorage.getItem('promakehub_lang') || '';
      if (stored.toLowerCase().indexOf('en') === 0) return 'en';
    } catch (error) {}
    return document.documentElement.lang === 'en' ? 'en' : 'zh';
  }

  function isEnglish() {
    return getAppLang() === 'en';
  }

  function getConfig(mode) {
    var key = modeConfigs[mode] ? mode : 'quickQuote';
    var base = modeConfigs[key];
    if (!isEnglish()) return base;
    var en = modeCopyEn[key] || modeCopyEn.quickQuote;
    return Object.assign({}, base, en);
  }

  function getLoginUrl(target) {
    var entryOrigin = window.__ZHIZAO_ENTRY_ORIGIN__ || 'http://localhost:5175';
    var lang = getAppLang();
    var path = lang === 'en' ? '/en/login' : '/login';
    return String(entryOrigin).replace(/\/$/, '') + path
      + '?lang=' + encodeURIComponent(lang)
      + '&redirect=' + encodeURIComponent(getLoginRedirectTarget(target));
  }

  function getRegisterUrl(target) {
    var entryOrigin = window.__ZHIZAO_ENTRY_ORIGIN__ || 'http://localhost:5175';
    var lang = getAppLang();
    var path = lang === 'en' ? '/en/register' : '/register';
    return String(entryOrigin).replace(/\/$/, '') + path
      + '?lang=' + encodeURIComponent(lang)
      + '&redirect=' + encodeURIComponent(getLoginRedirectTarget(target));
  }

  function getLoginRedirectTarget(target) {
    var localTarget = target || workspaceTargets.quote;
    if (String(localTarget).startsWith('/')) return localTarget;
    return '/quote#quote-upload';
  }

  function updateAuthLinks() {
    var config = getConfig(currentMode);
    if (loginContinue) loginContinue.href = getLoginUrl(config.target);
    if (registerContinue) registerContinue.href = getRegisterUrl(config.target);
  }

  function persistDraft(reason) {
    var config = getConfig(currentMode);
    var primaryFile = selectedFiles[0] || null;
    var draft = {
      source: 'marketing-guest-solution',
      mode: currentMode,
      modeLabel: config.label,
      primaryName: primaryFile ? primaryFile.name : '',
      fileCount: selectedFiles.length,
      text: needInput ? needInput.value.trim() : '',
      messages: guestMessages.slice(-8),
      guestMessageCount: guestMessageCount,
      target: config.target,
      reason: reason,
      createdAt: new Date().toISOString()
    };
    window.sessionStorage.setItem('agileGuestSolutionDraft', JSON.stringify(draft));
    window.sessionStorage.setItem('agileLoginRedirect', getLoginRedirectTarget(config.target));
    window.sessionStorage.setItem('agileGuestQuoteDraft', JSON.stringify({
      source: 'marketing-guest-upload',
      mode: currentMode,
      modeLabel: config.label,
      primaryName: draft.primaryName,
      fileCount: draft.fileCount,
      text: draft.text,
      messages: draft.messages,
      target: draft.target,
      createdAt: draft.createdAt
    }));
    return draft;
  }

  function updateQuota() {
    var remaining = Math.max(0, guestLimit - guestMessageCount);
    if (quotaPill) quotaPill.textContent = remaining + ' / ' + guestLimit;
    if (!quotaCopy) return;
    if (isEnglish()) {
      quotaCopy.textContent = remaining > 0
        ? remaining + ' light guest chats remaining'
        : 'Guest chat saved';
    } else {
      quotaCopy.textContent = remaining > 0
        ? '游客模式剩余 ' + remaining + ' 次轻量对话'
        : '游客对话已暂存';
    }
  }

  function resetChatBoard(config) {
    guestMessages = [];
    guestMessageCount = 0;
    if (chatBoard) {
      chatBoard.innerHTML = '';
      var prompt = document.createElement('div');
      prompt.className = 'guest-chat-prompt';
      var promptTitle = config.chatPrompt || (isEnglish()
        ? 'What manufacturing need should we start with?'
        : '今天想先评估什么制造需求？');
      var promptCopy = config.chatWelcome || (isEnglish()
        ? 'Describe your need first — I will help prepare what the workspace needs next.'
        : '可以先描述你的需求，我会帮你整理进入工作台前需要的信息。');
      prompt.innerHTML = '<span>' + config.label + '</span><strong>' + promptTitle + '</strong><p>' + promptCopy + '</p>';
      chatBoard.appendChild(prompt);
    }
    updateQuota();
  }

  function appendChatBubble(text, type, record) {
    if (!chatBoard) return;
    if (type === 'user') {
      var prompt = chatBoard.querySelector('.guest-chat-prompt');
      if (prompt) prompt.remove();
    }
    var bubble = document.createElement('div');
    bubble.className = 'guest-chat-bubble' + (type === 'user' ? ' is-user' : '') + (type === 'system' ? ' is-system' : '');
    bubble.textContent = text;
    chatBoard.appendChild(bubble);
    chatBoard.scrollTop = chatBoard.scrollHeight;
    if (record !== false) {
      guestMessages.push({ role: type === 'user' ? 'user' : 'assistant', content: text });
    }
  }

  function buildAssistantReply(config, userText) {
    var en = isEnglish();
    if (guestMessageCount >= guestLimit) {
      return en ? 'Current requirements have been saved.' : '已暂存当前需求。';
    }
    if (currentMode === 'smartQuote') {
      return en
        ? 'Noted. You can add material, quantity, lead time, or upload a model.'
        : '已记录。可以继续补充材料、数量、交期，或上传模型。';
    }
    if (currentMode === 'imageTo3d') {
      return en
        ? 'Image-to-model goal noted. Upload a reference image to add more detail.'
        : '已记录图片建模目标。可以上传参考图补充细节。';
    }
    if (currentMode === 'textTo3d') {
      return en
        ? 'Model description noted. Add size, structure constraints, or use case next.'
        : '已记录模型描述。可以继续补充尺寸、结构约束或使用场景。';
    }
    if (currentMode === 'dfm') {
      return en
        ? 'Review focus noted. Upload a model to add structure detail.'
        : '已记录检查关注点。可以上传模型补充结构信息。';
    }
    if (currentMode === 'rapidPrototype') {
      return en
        ? 'Noted. You can keep adding key requirements or upload files.'
        : '已记录，可以继续补充关键要求或上传资料。';
    }
    return en
      ? 'Noted. You can keep adding key requirements or upload files.'
      : '已记录。可以继续补充关键要求或上传资料。';
  }

  function showStatus(summary, message) {
    if (title) title.textContent = summary;
    if (detail) detail.textContent = message;
    if (percent) percent.textContent = isEnglish() ? 'Saved' : '已暂存';
    if (statusArea) statusArea.classList.remove('hidden');
    if (actions) actions.classList.remove('hidden');
  }

  function applyModeCopy(config) {
    setText('[data-mode-kicker]', config.kicker);
    setText('[data-mode-title]', config.title);
    setText('[data-mode-description]', config.description);
    config.points.forEach(function (point, index) {
      setText('[data-mode-point="' + index + '"]', point);
    });
    setText('[data-card-title]', config.cardTitle);
    setText('[data-card-description]', config.cardDescription);
    setText('[data-card-badge]', config.badge);
    setText('[data-drop-title]', config.dropTitle);
    setText('[data-drop-detail]', config.dropDetail);
    setText('[data-file-button]', config.fileButton);
    setText('[data-choice-copy]', config.choice);
    setText('[data-workflow-title]', config.workflowTitle);
    setText('[data-workflow-description]', config.workflowDescription);
    config.steps.forEach(function (step, index) {
      setText('[data-workflow-step-title="' + index + '"]', step[0]);
      setText('[data-workflow-step-copy="' + index + '"]', step[1]);
    });
    if (needInput) {
      needInput.placeholder = config.layout === 'upload'
        ? (config.placeholderUpload || (isEnglish()
          ? 'Add material, quantity, lead time, tolerance, or finishing notes...'
          : '补充材料、数量、交期、公差或表面处理...'))
        : (config.placeholderChat || (isEnglish()
          ? 'Describe needs, or tap + to upload files into the workspace...'
          : '输入一句需求，或点击左侧 + 上传资料进入工作台...'));
    }
    if (continueButton) {
      continueButton.textContent = config.layout === 'upload'
        ? (config.continueUpload || (isEnglish() ? 'Log in to workspace' : '登录并进入工作台'))
        : (config.continueChat || (isEnglish() ? 'Open workspace' : '进入工作台'));
    }
    var chatAnswer = document.querySelector('[data-chat-answer]');
    if (chatAnswer) {
      var hint = config.layout === 'upload'
        ? (config.chatHintUpload || (isEnglish()
          ? 'Upload files first, then log in to finish the quote.'
          : '上传资料后可登录继续完善报价。'))
        : (config.chatHintChat || (isEnglish()
          ? 'Clarify requirements first; uploads continue in the workspace.'
          : '可以先聊清楚需求；一旦上传资料或进入生成，将转到工作台继续。'));
      chatAnswer.innerHTML = '<strong>AgileMakeAI：</strong>' + hint;
    }
  }

  function setMode(mode) {
    currentMode = modeConfigs[mode] ? mode : 'quickQuote';
    var config = getConfig(currentMode);
    document.querySelectorAll('[data-mode-option]').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.modeOption === currentMode);
    });
    applyModeCopy(config);
    if (fileInput) {
      fileInput.accept = config.accept;
      fileInput.value = '';
    }
    if (needInput) {
      needInput.value = '';
    }
    selectedFiles = [];
    if (guestPanel) {
      guestPanel.classList.toggle('is-upload-mode', config.layout === 'upload');
      guestPanel.classList.toggle('is-chat-mode', config.layout !== 'upload');
    }
    var hero = document.querySelector('.guest-quote-hero');
    if (hero) {
      hero.classList.toggle('is-upload-layout', config.layout === 'upload');
      hero.dataset.layout = config.layout;
    }
    if (statusArea) statusArea.classList.add('hidden');
    if (actions) actions.classList.add('hidden');
    if (sendGuestMessage) sendGuestMessage.disabled = config.layout === 'upload';
    resetChatBoard(config);
    updateAuthLinks();
  }

  function validFiles(files) {
    var config = getConfig(currentMode);
    return Array.from(files || []).filter(function (file) {
      var extension = (file.name.split('.').pop() || '').toLowerCase();
      return config.allowed.indexOf(extension) !== -1;
    });
  }

  function handleFiles(files) {
    var config = getConfig(currentMode);
    var selected = validFiles(files);
    if (!selected.length) {
      window.alert(isEnglish()
        ? 'Please upload a file format supported by this entry.'
        : '请上传当前入口支持的文件格式。');
      return;
    }
    selectedFiles = selected;
    var summary = selected.length > 1
      ? (isEnglish()
        ? selected[0].name + ' and ' + selected.length + ' files'
        : selected[0].name + ' 等 ' + selected.length + ' 个文件')
      : selected[0].name;
    persistDraft('file-upload');
    if (config.layout !== 'upload') {
      appendChatBubble((isEnglish() ? 'Uploaded: ' : '已上传：') + summary, 'user');
      appendChatBubble(
        isEnglish()
          ? 'Files saved. Continuing in the workspace next.'
          : '资料已保存，接下来进入工作台继续处理。',
        'system'
      );
      window.location.href = getLoginUrl(config.target);
      return;
    }
    showStatus(
      summary,
      isEnglish()
        ? config.label + ' files saved — they will carry into the workspace after login.'
        : config.label + '资料已保存，登录后会继续带入对应工作台。'
    );
    var chatAnswer = document.querySelector('[data-chat-answer]');
    if (chatAnswer) {
      chatAnswer.innerHTML = '<strong>AgileMakeAI：</strong>' + (isEnglish()
        ? 'Received ' + summary + '. Add more needs, or log in to the workspace.'
        : '已收到 ' + summary + '。可继续补充需求，或登录进入工作台。');
    }
  }

  function submitGuestMessage() {
    var config = getConfig(currentMode);
    if (config.layout === 'upload') {
      persistDraft('continue');
      window.location.href = getLoginUrl(config.target);
      return;
    }
    var text = needInput ? needInput.value.trim() : '';
    if (!text) {
      appendChatBubble(
        isEnglish()
          ? 'Enter a short requirement first, or tap the attachment button to upload into the workspace.'
          : '可以先输入一句需求，或点击附件上传资料进入工作台。',
        'system',
        false
      );
      return;
    }
    if (guestMessageCount >= guestLimit) {
      persistDraft('guest-limit');
      showStatus(
        isEnglish() ? config.label + ' chat saved' : config.label + '对话已暂存',
        isEnglish() ? 'Current requirements are kept.' : '当前需求已保留。'
      );
      return;
    }
    appendChatBubble(text, 'user');
    guestMessageCount += 1;
    if (needInput) needInput.value = '';
    appendChatBubble(buildAssistantReply(config, text), 'assistant');
    updateQuota();
    persistDraft('guest-chat');
    if (guestMessageCount >= guestLimit) {
      showStatus(
        isEnglish() ? config.label + ' chat saved' : config.label + '对话已暂存',
        isEnglish() ? 'Current requirements are kept.' : '当前需求已保留。'
      );
    }
  }

  document.querySelectorAll('[data-mode-option]').forEach(function (button) {
    button.addEventListener('click', function () {
      setMode(button.dataset.modeOption);
      history.replaceState(null, '', location.pathname + '?mode=' + currentMode + '#quote-upload');
    });
  });

  document.querySelectorAll('[data-quick-chip]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!needInput) return;
      var current = needInput.value.trim();
      needInput.value = current ? current + '\n' + button.dataset.quickChip : button.dataset.quickChip;
      persistDraft('text-input');
    });
  });

  if (needInput) {
    needInput.addEventListener('input', function () {
      persistDraft('text-input');
    });
  }

  if (continueButton) {
    continueButton.addEventListener('click', function () {
      var config = getConfig(currentMode);
      var draft = persistDraft('continue');
      if (!draft.primaryName && !draft.text) {
        showStatus(
          isEnglish() ? config.label + ' needs more detail' : config.label + '需求待补充',
          config.layout === 'upload'
            ? (isEnglish() ? 'Upload files first, then log in to the workspace.' : '请先上传资料，再登录进入工作台。')
            : (isEnglish() ? 'Chat a short need first, or upload files into the workspace.' : '可以先聊一句需求，或上传资料进入工作台。')
        );
        return;
      }
      window.location.href = getLoginUrl(config.target);
    });
  }

  if (sendGuestMessage) {
    sendGuestMessage.addEventListener('click', submitGuestMessage);
  }

  if (needInput) {
    needInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitGuestMessage();
      }
    });
  }

  if (chatUploadTrigger && fileInput) {
    chatUploadTrigger.addEventListener('click', function () {
      fileInput.click();
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', function (event) {
      if (event.target !== fileInput) fileInput.click();
    });
    dropZone.addEventListener('dragover', function (event) {
      event.preventDefault();
      dropZone.classList.add('is-dragover');
    });
    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('is-dragover');
    });
    dropZone.addEventListener('drop', function (event) {
      event.preventDefault();
      dropZone.classList.remove('is-dragover');
      handleFiles(event.dataTransfer.files);
    });
    fileInput.addEventListener('change', function (event) {
      handleFiles(event.target.files);
    });
  }

  var initialMode = new URLSearchParams(window.location.search).get('mode') || window.location.hash.replace('#', '');
  setMode(initialMode || 'quickQuote');
})();
