import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  IconButton,
  HStack,
  useToast,
  Badge,
  useColorModeValue,
  ScaleFade,
  Flex,
  Icon,
  Divider,
  Code,
  useClipboard,
  Select,
  Textarea,
  Collapse,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { 
  AddIcon, 
  DeleteIcon, 
  EditIcon,
  CopyIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { 
  FiHome, 
  FiPlus, 
  FiCode, 
  FiZap,
  FiLayers,
  FiTarget,
  FiType,
  FiHash,
  FiList,
  FiPackage,
  FiChevronDown,
  FiChevronRight,
  FiMoreHorizontal,
  FiSettings,
  FiSave,
} from "react-icons/fi";
import { useState, useCallback, useMemo } from "react";
import { ReactComponent as SaweriaIcon } from "../assets/iconsweria.svg";

// Field types constants
const FIELD_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  OBJECT: 'object'
};

// Field type configurations
const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.STRING]: {
    icon: FiType,
    label: 'Text',
    color: 'blue',
    description: 'Simple text value'
  },
  [FIELD_TYPES.NUMBER]: {
    icon: FiHash,
    label: 'Number',
    color: 'green',
    description: 'Numeric value'
  },
  [FIELD_TYPES.ARRAY]: {
    icon: FiList,
    label: 'Array',
    color: 'purple',
    description: 'List of values'
  },
  [FIELD_TYPES.OBJECT]: {
    icon: FiPackage,
    label: 'Object',
    color: 'orange',
    description: 'Nested structure'
  }
};

export default function PromptJsonEnhanced() {
  const [subject, setSubject] = useState("");
  const [fields, setFields] = useState([]);
  const [jsonResult, setJsonResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(prompt);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, blue.50, purple.50)",
    "linear(to-br, gray.900, teal.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const fieldBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const borderColorFocus = useColorModeValue("white", "gray.700");

  // Generate unique ID
  const generateId = () => Date.now() + Math.random();

  // Add field function
  const addField = useCallback((parentId = null, type = FIELD_TYPES.STRING, insertAfter = null) => {
    const parentField = parentId ? fields.find(f => f.id === parentId) : null;
    const level = parentField ? parentField.level + 1 : 0;

    const newField = {
      id: generateId(),
      title: type === FIELD_TYPES.OBJECT ? "new_object" : "new_field",
      type,
      value: type === FIELD_TYPES.ARRAY ? [''] : type === FIELD_TYPES.NUMBER ? 0 : "",
      level,
      parentId,
      isExpanded: true
    };

    setFields(prev => {
      let insertIndex = insertAfter ?
        prev.findIndex(f => f.id === insertAfter) + 1 :
        prev.length;

      // If adding to a parent, insert after all children
      if (parentId && !insertAfter) {
        const parentIndex = prev.findIndex(f => f.id === parentId);
        let lastChildIndex = parentIndex;

        for (let i = parentIndex + 1; i < prev.length; i++) {
          if (prev[i].level <= prev[parentIndex].level) break;
          lastChildIndex = i;
        }
        insertIndex = lastChildIndex + 1;
      }

      const newFields = [...prev];
      newFields.splice(insertIndex, 0, newField);
      return newFields;
    });

    toast({
      title: "Field Ditambahkan",
      description: `Field ${FIELD_TYPE_CONFIG[type].label} berhasil ditambahkan`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  }, [fields, toast]);

  // Update field function
  const updateField = useCallback((id, updates) => {
    setFields(prev => prev.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  }, []);

  // Remove field function
  const removeField = useCallback((id) => {
    setFields(prev => {
      const fieldIndex = prev.findIndex(f => f.id === id);
      if (fieldIndex === -1) return prev;

      const field = prev[fieldIndex];
      const newFields = [];

      // Remove field and all its children
      for (let i = 0; i < prev.length; i++) {
        if (i === fieldIndex) continue;

        if (i > fieldIndex && prev[i].level > field.level) {
          // Skip children of removed field
          continue;
        }

        newFields.push(prev[i]);
      }

      return newFields;
    });

    toast({
      title: "Field Dihapus",
      description: "Field berhasil dihapus",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  }, [toast]);

  // Edit field title - FIXED: Using modal instead of prompt
  const openEditModal = useCallback((id) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      setEditingField(field);
      setEditTitle(field.title);
      onEditOpen();
    }
  }, [fields, onEditOpen]);

  // Save edited title
  const saveEditedTitle = useCallback(() => {
    if (editingField && editTitle.trim()) {
      updateField(editingField.id, { title: editTitle.trim() });
      toast({
        title: "Field Diperbarui",
        description: "Nama field berhasil diperbarui",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setEditingField(null);
    setEditTitle("");
    onEditClose();
  }, [editingField, editTitle, updateField, onEditClose, toast]);

  // Toggle object expansion
  const toggleExpanded = useCallback((id) => {
    updateField(id, { isExpanded: !fields.find(f => f.id === id).isExpanded });
  }, [fields, updateField]);

  // Add array item
  const addArrayItem = useCallback((fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === FIELD_TYPES.ARRAY) {
      const newValue = [...field.value, ''];
      updateField(fieldId, { value: newValue });
    }
  }, [fields, updateField]);

  // Remove array item
  const removeArrayItem = useCallback((fieldId, index) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === FIELD_TYPES.ARRAY) {
      const newValue = field.value.filter((_, i) => i !== index);
      updateField(fieldId, { value: newValue.length > 0 ? newValue : [''] });
    }
  }, [fields, updateField]);

  // Update array item
  const updateArrayItem = useCallback((fieldId, index, value) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === FIELD_TYPES.ARRAY) {
      const newValue = [...field.value];
      newValue[index] = value;
      updateField(fieldId, { value: newValue });
    }
  }, [fields, updateField]);

  // Generate JSON from fields
  const generateJsonFromFields = useCallback(() => {
    const result = {};

    const processFields = (parentId, targetObj) => {
      const fieldsAtLevel = fields.filter(f => f.parentId === parentId);

      fieldsAtLevel.forEach(field => {
        if (field.type === FIELD_TYPES.OBJECT) {
          targetObj[field.title] = {};
          processFields(field.id, targetObj[field.title]);
        } else if (field.type === FIELD_TYPES.ARRAY) {
          targetObj[field.title] = field.value.filter(v => v.trim() !== '');
        } else if (field.type === FIELD_TYPES.NUMBER) {
          targetObj[field.title] = field.value;
        } else {
          if (field.value.trim() !== '') {
            targetObj[field.title] = field.value;
          }
        }
      });
    };

    processFields(null, result);
    return result;
  }, [fields]);

  // Generate complete prompt
  const generate = useCallback(() => {
    if (!subject.trim()) {
      toast({
        title: "Subjek Diperlukan",
        description: "Mohon masukkan subjek prompt terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const jsonObj = generateJsonFromFields();
    const jsonString = JSON.stringify(jsonObj, null, 2);
    setJsonResult(jsonString);

    // Create complete prompt with subject separate from JSON
    const completePrompt = `${subject.trim()}\n\n${jsonString}`;
    setPrompt(completePrompt);
    
    toast({
      title: "Prompt Generated!",
      description: "Prompt JSON berhasil dibuat dan siap untuk dicopy",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }, [subject, generateJsonFromFields, toast]);

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Berhasil Dicopy!",
      description: "JSON prompt telah disalin ke clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  // Load template - IMPROVED: Better template structure
  const loadTemplate = () => {
    const templateFields = [
      { id: 1, title: "style", type: FIELD_TYPES.STRING, value: "modern minimalist", level: 0, parentId: null, isExpanded: true },
      { id: 2, title: "material", type: FIELD_TYPES.OBJECT, value: "", level: 0, parentId: null, isExpanded: true },
      { id: 3, title: "base", type: FIELD_TYPES.STRING, value: "premium plastic", level: 1, parentId: 2, isExpanded: true },
      { id: 4, title: "texture", type: FIELD_TYPES.STRING, value: "smooth matte", level: 1, parentId: 2, isExpanded: true },
      { id: 5, title: "finish", type: FIELD_TYPES.STRING, value: "semi-gloss", level: 1, parentId: 2, isExpanded: true },
      { id: 6, title: "lighting", type: FIELD_TYPES.OBJECT, value: "", level: 0, parentId: null, isExpanded: true },
      { id: 7, title: "type", type: FIELD_TYPES.STRING, value: "soft studio lighting", level: 1, parentId: 6, isExpanded: true },
      { id: 8, title: "intensity", type: FIELD_TYPES.STRING, value: "balanced", level: 1, parentId: 6, isExpanded: true },
      { id: 9, title: "color_scheme", type: FIELD_TYPES.OBJECT, value: "", level: 0, parentId: null, isExpanded: true },
      { id: 10, title: "primary", type: FIELD_TYPES.ARRAY, value: ["#2563eb", "#7c3aed", "#dc2626"], level: 1, parentId: 9, isExpanded: true },
      { id: 11, title: "secondary", type: FIELD_TYPES.ARRAY, value: ["#64748b", "#f1f5f9", "#0f172a"], level: 1, parentId: 9, isExpanded: true },
      { id: 12, title: "contrast", type: FIELD_TYPES.STRING, value: "high", level: 1, parentId: 9, isExpanded: true },
    ];

    setFields(templateFields);
    setSubject("Generate image based on the following design specifications");

    toast({
      title: "Template Dimuat!",
      description: "Template design modern berhasil dimuat",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Render field based on type
  const renderFieldInput = (field) => {
    const config = FIELD_TYPE_CONFIG[field.type];
    const indentStyle = { marginLeft: `${field.level * 20}px` };

    switch (field.type) {
      case FIELD_TYPES.STRING:
        return (
          <Box style={indentStyle}>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={config.icon} color={`${config.color}.500`} />
                  <Text fontWeight="bold" color={textColor} fontSize="sm">
                    {field.title}
                  </Text>
                  <Badge colorScheme={config.color} variant="subtle" size="sm">
                    {config.label}
                  </Badge>
                </HStack>
                <HStack spacing={1}>
                  <IconButton
                    size="xs"
                    icon={<EditIcon />}
                    aria-label="Edit title"
                    onClick={() => openEditModal(field.id)}
                    colorScheme="blue"
                    variant="ghost"
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<AddIcon />}
                      size="xs"
                      variant="ghost"
                      colorScheme="green"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FiType} />} onClick={() => addField(field.parentId, FIELD_TYPES.STRING, field.id)}>
                        Add Text Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiHash} />} onClick={() => addField(field.parentId, FIELD_TYPES.NUMBER, field.id)}>
                        Add Number Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiList} />} onClick={() => addField(field.parentId, FIELD_TYPES.ARRAY, field.id)}>
                        Add Array Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiPackage} />} onClick={() => addField(field.parentId, FIELD_TYPES.OBJECT, field.id)}>
                        Add Object Field
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <IconButton
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label="Delete field"
                    onClick={() => removeField(field.id)}
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
              <Input
                placeholder="Enter text value..."
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                size="sm"
                borderRadius="lg"
                _focus={{ borderColor: `${config.color}.500` }}
                bg={cardBg}
              />
            </VStack>
          </Box>
        );

      case FIELD_TYPES.NUMBER:
        return (
          <Box style={indentStyle}>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={config.icon} color={`${config.color}.500`} />
                  <Text fontWeight="bold" color={textColor} fontSize="sm">
                    {field.title}
                  </Text>
                  <Badge colorScheme={config.color} variant="subtle" size="sm">
                    {config.label}
                  </Badge>
                </HStack>
                <HStack spacing={1}>
                  <IconButton
                    size="xs"
                    icon={<EditIcon />}
                    aria-label="Edit title"
                    onClick={() => openEditModal(field.id)}
                    colorScheme="blue"
                    variant="ghost"
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<AddIcon />}
                      size="xs"
                      variant="ghost"
                      colorScheme="green"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FiType} />} onClick={() => addField(field.parentId, FIELD_TYPES.STRING, field.id)}>
                        Add Text Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiHash} />} onClick={() => addField(field.parentId, FIELD_TYPES.NUMBER, field.id)}>
                        Add Number Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiList} />} onClick={() => addField(field.parentId, FIELD_TYPES.ARRAY, field.id)}>
                        Add Array Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiPackage} />} onClick={() => addField(field.parentId, FIELD_TYPES.OBJECT, field.id)}>
                        Add Object Field
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <IconButton
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label="Delete field"
                    onClick={() => removeField(field.id)}
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
              <NumberInput
                value={field.value}
                onChange={(value) => updateField(field.id, { value: parseFloat(value) || 0 })}
                size="sm"
              >
                <NumberInputField
                  borderRadius="lg"
                  _focus={{ borderColor: `${config.color}.500` }}
                  bg={cardBg}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </VStack>
          </Box>
        );

      case FIELD_TYPES.ARRAY:
        return (
          <Box style={indentStyle}>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={config.icon} color={`${config.color}.500`} />
                  <Text fontWeight="bold" color={textColor} fontSize="sm">
                    {field.title}
                  </Text>
                  <Badge colorScheme={config.color} variant="subtle" size="sm">
                    {config.label} ({field.value.length})
                  </Badge>
                </HStack>
                <HStack spacing={1}>
                  <IconButton
                    size="xs"
                    icon={<EditIcon />}
                    aria-label="Edit title"
                    onClick={() => openEditModal(field.id)}
                    colorScheme="blue"
                    variant="ghost"
                  />
                  <IconButton
                    size="xs"
                    icon={<AddIcon />}
                    aria-label="Add array item"
                    onClick={() => addArrayItem(field.id)}
                    colorScheme="purple"
                    variant="ghost"
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiPlus />}
                      size="xs"
                      variant="ghost"
                      colorScheme="green"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FiType} />} onClick={() => addField(field.parentId, FIELD_TYPES.STRING, field.id)}>
                        Add Text Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiHash} />} onClick={() => addField(field.parentId, FIELD_TYPES.NUMBER, field.id)}>
                        Add Number Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiList} />} onClick={() => addField(field.parentId, FIELD_TYPES.ARRAY, field.id)}>
                        Add Array Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiPackage} />} onClick={() => addField(field.parentId, FIELD_TYPES.OBJECT, field.id)}>
                        Add Object Field
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <IconButton
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label="Delete field"
                    onClick={() => removeField(field.id)}
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
              <VStack spacing={1} align="stretch">
                {field.value.map((item, index) => (
                  <HStack key={index} spacing={2}>
                    <Text fontSize="xs" color={mutedColor} w="20px">
                      {index}:
                    </Text>
                    <Input
                      placeholder={`Item ${index + 1}`}
                      value={item}
                      onChange={(e) => updateArrayItem(field.id, index, e.target.value)}
                      size="sm"
                      borderRadius="lg"
                      _focus={{ borderColor: `${config.color}.500` }}
                      bg={cardBg}
                      flex={1}
                    />
                    <IconButton
                      size="xs"
                      icon={<DeleteIcon />}
                      aria-label="Remove item"
                      onClick={() => removeArrayItem(field.id, index)}
                      colorScheme="red"
                      variant="ghost"
                      isDisabled={field.value.length === 1}
                    />
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
        );

      case FIELD_TYPES.OBJECT:
        return (
          <Box style={indentStyle}>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <IconButton
                    size="xs"
                    icon={field.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    aria-label="Toggle expansion"
                    onClick={() => toggleExpanded(field.id)}
                    variant="ghost"
                  />
                  <Icon as={config.icon} color={`${config.color}.500`} />
                  <Text fontWeight="bold" color={textColor} fontSize="sm">
                    {field.title}
                  </Text>
                  <Badge colorScheme={config.color} variant="subtle" size="sm">
                    {config.label}
                  </Badge>
                </HStack>
                <HStack spacing={1}>
                  <IconButton
                    size="xs"
                    icon={<EditIcon />}
                    aria-label="Edit title"
                    onClick={() => openEditModal(field.id)}
                    colorScheme="blue"
                    variant="ghost"
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<AddIcon />}
                      size="xs"
                      variant="ghost"
                      colorScheme="green"
                    />
                    <MenuList>
                      <MenuItem icon={<Icon as={FiType} />} onClick={() => addField(field.id, FIELD_TYPES.STRING)}>
                        Add Text Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiHash} />} onClick={() => addField(field.id, FIELD_TYPES.NUMBER)}>
                        Add Number Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiList} />} onClick={() => addField(field.id, FIELD_TYPES.ARRAY)}>
                        Add Array Field
                      </MenuItem>
                      <MenuItem icon={<Icon as={FiPackage} />} onClick={() => addField(field.id, FIELD_TYPES.OBJECT)}>
                        Add Nested Object
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <IconButton
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label="Delete field"
                    onClick={() => removeField(field.id)}
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
            </VStack>
          </Box>
        );

      default:
        return null;
    }
  };

  // Get visible fields (considering collapsed objects)
  const visibleFields = useMemo(() => {
    const visibleFields = [];

    const processField = (field) => {
      visibleFields.push(field);

      if (field.type === FIELD_TYPES.OBJECT && field.isExpanded) {
        const children = fields.filter(f => f.parentId === field.id);
        children.forEach(processField);
      }
    };

    fields.filter(f => f.parentId === null).forEach(processField);
    return visibleFields;
  }, [fields]);

  return (
    <Box 
      bgGradient={bgGradient}
      minH="100vh" 
      py={12}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorations */}
      <Box
        position="absolute"
        top="-100px"
        left="-100px"
        width="300px"
        height="300px"
        borderRadius="full"
        bgGradient="linear(to-br, teal.300, blue.300)"
        opacity={0.1}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-50px"
        right="-50px"
        width="200px"
        height="200px"
        borderRadius="full"
        bgGradient="linear(to-tl, purple.300, pink.300)"
        opacity={0.1}
        zIndex={0}
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <ScaleFade initialScale={0.9} in={true}>
          <VStack spacing={10} w="full">
            {/* Header Section */}
            <Box textAlign="center" w="full">
              <Flex
                justify="space-between"
                align="center"
                mb={6}
                flexWrap="wrap"
              >
                <VStack align="start" spacing={3} flex={1} maxW="full">
                  <Badge 
                    colorScheme="teal" 
                    variant="subtle" 
                    px={3} 
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    <Icon as={FiCode} mr={2} />
                    Advanced JSON Generator
                  </Badge>
                  <Heading 
                    color={textColor}
                    fontSize={{ base: "3xl", md: "5xl" }}
                    fontWeight="900"
                    bgGradient="linear(to-r, teal.500, blue.500, purple.500)"
                    bgClip="text"
                    lineHeight="shorter"
                  >
                    Prompt Modular JSON Enhanced
                  </Heading>
                  <Text 
                    color={mutedColor} 
                    fontSize={{ base: "lg", md: "xl" }}
                    maxW="2xl"
                    lineHeight="tall"
                  >
                    Buat JSON kompleks dengan nested objects, arrays, dan berbagai tipe data. Subject terpisah dari struktur JSON.
                  </Text>
                </VStack>

                {/* Buttons Section */}
                <Box
                  display="flex"
                  gap={4}
                  flexWrap="wrap"
                  justify="center"
                  w="full"
                >
                  <Button
                    size="md"
                    variant="ghost"
                    colorScheme="teal"
                    leftIcon={<Icon as={FiSettings} />}
                    onClick={loadTemplate}
                    _hover={{
                      bg: "teal.50",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    transition="all 0.3s ease"
                  >
                    Load Template
                  </Button>
                  <a
                    href="https://laimonprompt.blogspot.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="md"
                      variant="ghost"
                      colorScheme="teal"
                      leftIcon={<Icon as={FiHome} />}
                      _hover={{
                        bg: "blue.50",
                        transform: "translateY(-2px)",
                        shadow: "lg",
                      }}
                      transition="all 0.3s ease"
                      w={{ base: "100%", sm: "auto" }}
                    >
                      Home
                    </Button>
                  </a>
                  <a
                    href="https://saweria.co/laimondev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="md"
                      variant="ghost"
                      colorScheme="teal"
                      leftIcon={<SaweriaIcon width="20px" height="20px" />}
                      _hover={{
                        bg: "blue.50",
                        transform: "translateY(-2px)",
                        shadow: "lg",
                      }}
                      transition="all 0.3s ease"
                      w={{ base: "100%", sm: "auto" }}
                    >
                      Saweria
                    </Button>
                  </a>
                </Box>
              </Flex>
            </Box>

            <Flex gap={8} w="full" direction={{ base: "column", xl: "row" }}>
              {/* Main Input Card */}
              <Box flex={2} minW={0}>
                <Box
                  bg={cardBg}
                  p={{ base: 6, md: 8 }}
                  borderRadius="3xl"
                  shadow="2xl"
                  w="full"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={borderColorFocus}
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bgGradient: "linear(to-r, teal.500, blue.500, purple.500)",
                    borderTopRadius: "3xl",
                  }}
                >
                  <VStack spacing={6} align="stretch">
                    {/* Subject Input */}
                    <Box>
                      <HStack mb={4}>
                        <Icon as={FiTarget} color="teal.500" fontSize="20" />
                        <Heading size="md" color={textColor}>
                          Subject (Terpisah dari JSON)
                        </Heading>
                      </HStack>
                      <Textarea
                        size="md"
                        placeholder="Contoh: Generate image based on the following design specifications"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        borderColor="gray.200"
                        borderRadius="xl"
                        _hover={{ borderColor: "teal.300" }}
                        _focus={{ 
                          borderColor: "teal.500", 
                          boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)" 
                        }}
                        bg={inputBg}
                        rows={3}
                        fontSize="md"
                      />
                    </Box>

                    <Divider />

                    {/* Dynamic Fields Section */}
                    <Box>
                      <HStack justify="space-between" mb={4}>
                        <HStack>
                          <Icon as={FiLayers} color="blue.500" fontSize="20" />
                          <Heading size="md" color={textColor}>
                            JSON Structure
                          </Heading>
                          <Badge colorScheme="blue" variant="subtle">
                            {fields.length} field{fields.length !== 1 ? 's' : ''}
                          </Badge>
                        </HStack>
                        <Menu>
                          <MenuButton
                            as={Button}
                            leftIcon={<AddIcon />}
                            size="sm"
                            colorScheme="teal"
                            variant="ghost"
                            _hover={{ bg: "teal.50" }}
                          >
                            Add Field
                          </MenuButton>
                          <MenuList>
                            <MenuItem icon={<Icon as={FiType} />} onClick={() => addField(null, FIELD_TYPES.STRING)}>
                              Text Field
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiHash} />} onClick={() => addField(null, FIELD_TYPES.NUMBER)}>
                              Number Field
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiList} />} onClick={() => addField(null, FIELD_TYPES.ARRAY)}>
                              Array Field
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiPackage} />} onClick={() => addField(null, FIELD_TYPES.OBJECT)}>
                              Object Field
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>

                      <VStack spacing={4} align="stretch">
                        {visibleFields.map((field) => (
                          <Box
                            key={field.id}
                            p={4}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={borderColor}
                            bg={fieldBg}
                            _hover={{ borderColor: `${FIELD_TYPE_CONFIG[field.type].color}.300` }}
                            transition="all 0.2s ease"
                          >
                            {renderFieldInput(field)}
                          </Box>
                        ))}

                        {fields.length === 0 && (
                          <Box
                            p={8}
                            textAlign="center"
                            borderRadius="xl"
                            border="2px dashed"
                            borderColor={borderColor}
                          >
                            <Icon as={FiPlus} fontSize="40" color="gray.400" mb={3} />
                            <Text color="gray.500" mb={3}>
                              Belum ada field JSON. Klik tombol "Add Field" untuk memulai.
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="teal"
                              variant="outline"
                              onClick={loadTemplate}
                              leftIcon={<Icon as={FiSettings} />}
                            >
                              Coba Template Modern
                            </Button>
                          </Box>
                        )}
                      </VStack>
                    </Box>

                    {/* Generate Button */}
                    <Button
                      size="lg"
                      h="60px"
                      bgGradient="linear(to-r, teal.500, blue.500)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, teal.600, blue.600)",
                        transform: "translateY(-2px)",
                        shadow: "xl",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      onClick={generate}
                      isDisabled={!subject.trim()}
                      leftIcon={<Icon as={FiZap} />}
                      borderRadius="xl"
                      fontSize="lg"
                      fontWeight="bold"
                      transition="all 0.3s ease"
                      w="full"
                    >
                      Generate JSON Prompt
                    </Button>
                  </VStack>
                </Box>
              </Box>

              {/* Result Card */}
              {prompt && (
                <Box flex={1} minW={{ xl: "400px" }}>
                  <Box
                    bg={cardBg}
                    p={{ base: 6, md: 8 }}
                    borderRadius="3xl"
                    shadow="2xl"
                    w="full"
                    backdropFilter="blur(10px)"
                    border="1px solid"
                    borderColor={borderColorFocus}
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      bgGradient: "linear(to-r, green.500, teal.500)",
                      borderTopRadius: "3xl",
                    }}
                  >
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiCode} color="green.500" fontSize="20" />
                          <Heading size="md" color={textColor}>
                            Complete Prompt
                          </Heading>
                          <Badge colorScheme="green" variant="subtle">
                            Ready
                          </Badge>
                        </HStack>
                        <Button
                          size="sm"
                          colorScheme={hasCopied ? "green" : "teal"}
                          variant="outline"
                          onClick={handleCopy}
                          leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                          _hover={{ transform: "translateY(-1px)" }}
                          transition="all 0.2s ease"
                        >
                          {hasCopied ? "Tersalin!" : "Copy Prompt"}
                        </Button>
                      </HStack>
                      
                      <Box
                        bg="gray.900"
                        p={4}
                        borderRadius="xl"
                        maxH="500px"
                        overflowY="auto"
                      >
                        <Code
                          colorScheme="green"
                          fontSize="sm"
                          whiteSpace="pre-wrap"
                          color="green.300"
                          bg="transparent"
                          p={0}
                          display="block"
                          lineHeight="tall"
                        >
                          {prompt}
                        </Code>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              )}
            </Flex>
          </VStack>
        </ScaleFade>
      </Container>

      {/* Edit Field Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Field Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Field Name</FormLabel>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter field name..."
                autoFocus
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveEditedTitle} leftIcon={<Icon as={FiSave} />}>
              Save
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}