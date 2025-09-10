import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
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
  Stack,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { 
  CopyIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import { 
  FiHome, 
  FiCode, 
  FiZap,
  FiTarget,
  FiLayers,
  FiRefreshCw,
} from "react-icons/fi";
import { useState, useCallback } from "react";
import { ReactComponent as SaweriaIcon } from "../assets/iconsweria.svg";

// Default options for dropdowns
const DROPDOWN_OPTIONS = {
  mode: [
    "Single prompt",
    "Multiple selection",
    "Bulk prompting"
  ],
  preset: [
    "no style",
    "3D Nendoroid",
    "Watercolor gnomes",
    "Cute kawaii",
    "Fantasy world",
    "Fantasy pattern",
    "Comic book",
    "Disney",
    "Quirky creature"
  ],
  digitalProduct: [
    "fantasy illustration",
    "clipart",
    "sticker",
    "illustration",
    "coloring page for kids",
    "coloring page for adults",
    "ui poster",
    "background image",
    "frame",
    "invitation frame",
    "pattern",
    "digital paper"
  ],
  creature: [
    "no style",
    "-- HUMAN-LIKE --",
    "princess",
    "prince charming",
    "mermaid",
    "vampire",
    "witch",
    "wizard",
    "siren",
    "genie",
    "fairy",
    "elf",
    "ogre",
    "gnome",
    "dwarf",
    "satyr",
    "nymph",

    "-- MYTHICAL --",
    "dragon",
    "unicorn",
    "phoenix",
    "pegasus",
    "minotaur",
    "gargoyle",
    "chimera",
    "basilisk",
    "cerberus",
    "hydra",
    "centaur",
    "kraken",
    "yeti",
    "cyclops",

    "-- SUPERNATURAL --",
    "ghost",
    "zombie",
    "werewolf",
    "goblin",
    "orc",
    "specter",
    "banshee",
    "wraith",
    "demon",
    "angel",
    "djinn",
    "poltergeist",
    "wendigo",
    "shadow",
    "imp",
    "-- LEGENDARY --",

    "thunderbird",
    "kitsune",
    "leviathan",
    "valkyrie",
    "dullahan",

    "-- HYBRID --",
    "parrohorse (fantasy creature with parrot head and horse body)",
    "griffin (fantasy creature with eagle head and wings and lion body)",
    "phoenixicorn (mythical creature with the body of a unicorn and the fiery wings of a phoenix)",
    "drakalope (fantasy creature with dragon wings and a rabbit-like body)",
    "lizardfolk (powerful creature with a human-like body and lizard head)",
    "owluman (wise creature with a human-like body and owl head)",
  ],
  creatureDetails: [
    "no style",
    "male",
    "female",
    "huge",
    "big",
    "tiny",
    "little",
    "young",
    "mature",
    "old",
    "charming",
    "cute",
    "adorable",
    "quirky",
    "monstrous",
    "funny",
    "comical",
    "kind",
    "evil",
    "villain",
    "warrior",
    "dollcore",
    "musclecore",
    "big eyes",
    "exaggerated body proportions",
    "with wings",
    "with fangs",
    "has hooves",
    "has horn",
    "clad in feathers",
    "on fire",
    "wearing dress",
    "wearing costume",
    "wearing hat",
    "wearing pants",
    "wearing shirt",
    "wearing knitted apparel and tailed hat",
    "wearing glasses",
    "wearing armor",
    "closeup view",
    "front face view",
    "profile view",
    "portrait view",
    "full body view",
    "mascot",
    "nendoroid"
  ],
  background: [
    "no style",
    "isolated on white",
    "isolated on black",
    "isolated on beige",
    "isolated on green",
    "isolated on blue",
    "isolated on red",
    "-- ENCHANTED REALMS --",
    "fantasy world",
    "magic castle",
    "enchanted woods",
    "fairy glade",
    "mystical garden",
    "wizard's tower interior",
    "elven forest",
    "celestial kingdom",
    "spring meadow",
    "lair in a cave",
    "underwater lagoon",
    "mushroom forest",
    "-- MYTHICAL LANDSCAPES --",
    "ancient ruins",
    "mystical mountains",
    "underwater city",
    "fiery volcano",
    "frozen wasteland",
    "haunted mansion",
    "celestial palace",
    "dark abyss",
    "enchanted lake",
    "celestial gardens",
    "-- OTHERWORLDLY SETTINGS --",
    "steampunk city",
    "alien planet",
    "cybernetic world",
    "post-apocalyptic wasteland",
    "celestial observatory",
    "time-traveling dimension",
    "underwater caverns",
    "cosmic void",
    "magical marketplace",
    "dreamlike realm"
  ],
  moodVibeAtmosphere: [
    "no style",
    "-- EMOTIONS --",
    "joyful emotion",
    "fearful emotion",
    "wondrous emotion",
    "melancholic emotion",
    "excited emotion",
    "serene emotion",
    "smiling",
    "fierce emotion",
    "determined emotion",
    "-- VIBE --",
    "enchanting vibe",
    "whimsical vibe",
    "mystical vibe",
    "ethereal vibe",
    "heroic vibe",
    "grand vibe",
    "adventurous vibe",
    "eerie vibe",
    "spooky vibe",
    "foreboding vibe",
    "-- ATMOSPHERE --",
    "fairy-tale atmosphere",
    "mythic atmosphere",
    "valiant atmosphere",
    "elemental atmosphere",
    "wild atmosphere",
    "cosmic atmosphere",
    "futuristic atmosphere",
    "alien atmosphere",
    "surreal atmosphere"
  ],
  colorPalette: [
    "no style",
    "monochrome",
    "light",
    "dark",
    "pale",
    "bright",
    "retro",
    "desaturated",
    "saturated",
    "subtle",
    "muted",
    "mild tones",
    "vintage",
    "ombre shading",
    "pure",
    "matte",
    "faded",
    "rich",
    "vivid",
    "vibrant",
    "acid",
    "shiny",
    "luminescent",
    "glowing",
    "glittery",
    "metallic",
    "neon",
    "duotone",
    "color pop"
  ],
  colorPreset: [
    "no style",
    "neutral",
    "eco",
    "pastel",
    "cool-toned",
    "warm-toned",
    "night",
    "light gold and bronze",
    "dark blue and mahogany",
    "night",
    "beige white",
    "beige grey",
    "silver blue",
    "blue pink",
    "pink purple",
    "brown green",
    "violet gold",
    "bronze blue",
    "white silver",
    "green black",
    "red navy blue",
    "orange purple",
    "maroon silver pink",
    "shades of beige",
    "shades of pink",
    "shades of maroon",
    "shades of violet",
    "shades of yellow",
    "shades of red",
    "shades of orange",
    "shades of purple",
    "shades of blue",
    "shades of green",
    "shades of brown",
    "grayscale",
    "black and white"
  ],
  basicStyle: [
    "no style",
    "2D flat",
    "3D",
    "cute",
    "cartoonish",
    "minimalistic",
    "futuristic",
    "simple",
    "vector",
    "photorealistic",
    "realistic yet ethereal",
    "isometric",
    "carved paper",
    "abstract",
    "geometric",
    "multi-layered"
  ],
  artStyle: [
    "no style",
    "-- GENERIC --",
    "anime art",
    "airbrush art",
    "acrylic paint",
    "charcoal sketch",
    "concept art",
    "digital art",
    "oil paint",
    "pencil hand drawing",
    "vector art",
    "watercolor paint",
    "-- ARTISTS AND STUDIOS --",
    "inspired by Anna Haifisch",
    "inspired by Artgerm",
    "inspired by Bill Watterson",
    "inspired by Boris Vallejo",
    "inspired by Charles Schulz",
    "inspired by Disney concept art",
    "inspired by Dreamworks animation studio",
    "inspired by Frank Frazetta",
    "inspired by Gerald Brom",
    "inspired by Glen Keane",
    "inspired by Luis Royo",
    "inspired by Marc Bell",
    "inspired by Matt Groening",
    "inspired by Matthew Abram",
    "inspired by Osamu Tezuka",
    "inspired by Pixar cartoon",
    "inspired by studio Ghibli",
    "-- ART STYLE --",
    "8-bit art style",
    "baroque style",
    "batik style",
    "Chibi style",
    "Chinese MMO style",
    "cyber guochao style",
    "dark synth style",
    "encaustic style",
    "folk art style",
    "glampunk style",
    "gothic art style",
    "impasto style",
    "kawaii style",
    "kirigami style",
    "magic realism style",
    "mosaic style",
    "steampunk style",
    "tilt-shift photography style"
  ],
  styleDetails: [
    "no style",
    "symmetrical",
    "very detailed 8K",
    "low detail",
    "soft-edged",
    "sharp-edged",
    "high contrast",
    "strong shadows",
    "chiaroscuro",
    "contour and clear outlines",
    "suitable for coloring",
    "line art drawing",
    "hand painted",
    "hand drawn lines",
    "handmade drawing",
    "solid colors",
    "elongated forms",
    "flowing silhouettes",
    "transparency and opacity",
    "whimsical illustration",
    "quirky characters",
    "elaborate details",
    "muted whimsy"
  ],
  midjourneyVersion: [
    "no style",
    "--v 7",
    "--v 6.1",
    "--v 6.0",
    "--v 5.2",
    "--v 5.1",
    "--v 5.0",
    "--niji 6",
    "--niji 5",
    "--niji 4",
    "--v 4.0",
    "--v 3.0",
    "--v 2.0",
    "--v 1.0"
  ],
  stylizeValue: [
    "no style",
    "--s 0",
    "--s 10",
    "--s 50",
    "--s 100",
    "--s 250",
    "--s 300",
    "--s 500",
    "--s 750",
    "--s 1000",
    "--style raw",
    "--iw 1",
    "--iw 2",
    "--iw 3",
    "--cw 0",
    "--cw 10",
    "--cw 50",
    "--cw 100",
    "--sw 10",
    "--sw 50",
    "--sw 100",
    "--sw 250",
    "--sw 300",
    "--sw 500",
    "--sw 750",
    "--sw 1000"
  ],
  aspectRatio: [
    "no style",
    "--ar 1:1",
    "--ar 9:16",
    "--ar 16:9",
    "--ar 1:2",
    "--ar 2:1",
    "--ar 3:4",
    "--ar 4:3",
    "--ar 2:3",
    "--ar 3:2",
    "--ar 17:22",
    "--ar 22:17",
    "--tile"
  ],
  parametersToExclude: [
    "no style",
    "--no background (transparent background)",
    "--no humans, people, children, men, women",
    "--no water",
    "--no trees",
    "--no frame",
    "--no buildings",
    "--no greenery",
    "--no fangs",
    "--no wings",
    "--no freckles",
    "--no animals",
    "--no tail",
    "--no colors",
    "--no flowers",
    "--no eyes",
    "--no eyes brows cheeks ears",
    "--no shading",
    "--no gradient",
    "--no shading, gradient",
    "--no skulls",
    "--no white",
    "--no grey",
    "--no black",
    "--no yellow",
    "--no orange",
    "--no pink",
    "--no red",
    "--no blue",
    "--no green",
    "--no purple"
  ]
};

export default function PromptJsonEnhanced() {
  // Form state
  const [formData, setFormData] = useState({
    // Header
    mode: "Single prompt",
    preset: "No preset",

    // Composition
    digitalProduct: "fantasy illustration",
    creature: "no style",
    creatureDetails: "no style",
    background: "no style",
    moodVibeAtmosphere: "no style",
    customCreature: "",
    customDetails: "",

    // Style
    colorPalette: "no style",
    colorPreset: "no style",
    customColors: "",
    basicStyle: "no style",
    artStyle: "no style",
    styleDetails: "no style",
    customStyleOrDetails: "",

    // Parameters
    midjourneyVersion: "no style",
    stylizeValue: "no style",
    aspectRatio: "no style",
    imageRefImage: "",
    characterRefImage: "",
    styleRefImage: "",
    parametersToExclude: "no style"
  });

  const [jsonResult, setJsonResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [outputFormat, setOutputFormat] = useState("both"); // "json", "text", "both"

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(outputFormat === "json" ? prompt : outputFormat === "text" ? textPrompt : `${textPrompt}\n\n--- JSON ---\n${prompt}`);

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, blue.50, purple.50)",
    "linear(to-br, gray.900, teal.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const borderColorFocus = useColorModeValue("white", "gray.700");

  // Update form data
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Reset all form data
  const resetAll = useCallback(() => {
    setFormData({
      mode: "Single prompt",
      preset: "No preset",
      digitalProduct: "fantasy illustration",
      creature: "no style",
      creatureDetails: "no style",
      background: "no style",
      moodVibeAtmosphere: "no style",
      customCreature: "",
      customDetails: "",
      colorPalette: "no style",
      colorPreset: "no style",
      customColors: "",
      basicStyle: "no style",
      artStyle: "no style",
      styleDetails: "no style",
      customStyleOrDetails: "",
      midjourneyVersion: "no style",
      stylizeValue: "no style",
      aspectRatio: "no style",
      imageRefImage: "",
      characterRefImage: "",
      styleRefImage: "",
      parametersToExclude: "no style"
    });
    setJsonResult("");
    setPrompt("");
    setTextPrompt("");

    toast({
      title: "Form Reset",
      description: "Semua field telah direset ke nilai default",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  }, [toast]);

  // Generate text prompt format
  const generateTextPrompt = useCallback((data) => {
    let textParts = [];

    // Add digital product as base
    textParts.push(data.digitalProduct);

    // Add creature and details
    if (data.creature !== "no style") {
      textParts.push(data.creature);
    }
    if (data.creatureDetails !== "no style") {
      textParts.push(data.creatureDetails);
    }
    if (data.customCreature) {
      textParts.push(data.customCreature);
    }
    if (data.customDetails) {
      textParts.push(data.customDetails);
    }

    // Add background
    if (data.background !== "no style") {
      textParts.push(`${data.background} background`);
    }

    // Add mood/atmosphere
    if (data.moodVibeAtmosphere !== "no style") {
      textParts.push(`${data.moodVibeAtmosphere} atmosphere`);
    }

    // Add style elements
    if (data.basicStyle !== "no style") {
      textParts.push(data.basicStyle);
    }
    if (data.artStyle !== "no style") {
      textParts.push(`${data.artStyle} style`);
    }
    if (data.styleDetails !== "no style") {
      textParts.push(data.styleDetails);
    }
    if (data.customStyleOrDetails) {
      textParts.push(data.customStyleOrDetails);
    }

    // Add color information
    if (data.colorPalette !== "no style") {
      textParts.push(`${data.colorPalette} color palette`);
    }
    if (data.colorPreset !== "no style") {
      textParts.push(`${data.colorPreset} colors`);
    }
    if (data.customColors) {
      textParts.push(`colors: ${data.customColors}`);
    }

    // Join main prompt parts
    let mainPrompt = textParts.join(", ");

    // Add parameters
    let parameters = [];

    if (data.midjourneyVersion !== "no style") {
      parameters.push(`--v ${data.midjourneyVersion}`);
    }
    if (data.stylizeValue !== "no style") {
      parameters.push(`--s ${data.stylizeValue}`);
    }
    if (data.aspectRatio !== "no style") {
      parameters.push(`--ar ${data.aspectRatio}`);
    }
    if (data.parametersToExclude !== "no style") {
      parameters.push(`--no ${data.parametersToExclude}`);
    }

    // Add reference images
    if (data.imageRefImage) {
      mainPrompt = `${data.imageRefImage} ${mainPrompt}`;
    }
    if (data.characterRefImage) {
      parameters.push(`--cref ${data.characterRefImage}`);
    }
    if (data.styleRefImage) {
      parameters.push(`--sref ${data.styleRefImage}`);
    }

    // Combine prompt with parameters
    let finalPrompt = mainPrompt;
    if (parameters.length > 0) {
      finalPrompt += ` ${parameters.join(" ")}`;
    }

    return finalPrompt;
  }, []);

  // Generate JSON and prompt
  const generate = useCallback(() => {
    // Create JSON object
    const jsonObj = {
      mode: formData.mode,
      preset: formData.preset,
      composition: {
        digital_product: formData.digitalProduct,
        creature: formData.creature !== "no style" ? formData.creature : null,
        creature_details: formData.creatureDetails !== "no style" ? formData.creatureDetails : null,
        background: formData.background !== "no style" ? formData.background : null,
        mood_vibe_atmosphere: formData.moodVibeAtmosphere !== "no style" ? formData.moodVibeAtmosphere : null,
        custom_creature: formData.customCreature || null,
        custom_details: formData.customDetails || null
      },
      style: {
        color_palette: formData.colorPalette !== "no style" ? formData.colorPalette : null,
        color_preset: formData.colorPreset !== "no style" ? formData.colorPreset : null,
        custom_colors: formData.customColors || null,
        basic_style: formData.basicStyle !== "no style" ? formData.basicStyle : null,
        art_style: formData.artStyle !== "no style" ? formData.artStyle : null,
        style_details: formData.styleDetails !== "no style" ? formData.styleDetails : null,
        custom_style_or_details: formData.customStyleOrDetails || null
      },
      parameters: {
        midjourney_version: formData.midjourneyVersion !== "no style" ? formData.midjourneyVersion : null,
        stylize_value: formData.stylizeValue !== "no style" ? formData.stylizeValue : null,
        aspect_ratio: formData.aspectRatio !== "no style" ? formData.aspectRatio : null,
        image_ref_image: formData.imageRefImage || null,
        character_ref_image: formData.characterRefImage || null,
        style_ref_image: formData.styleRefImage || null,
        parameters_to_exclude: formData.parametersToExclude !== "no style" ? formData.parametersToExclude : null
      }
    };

    // Remove null values
    const cleanObj = JSON.parse(JSON.stringify(jsonObj, (k, v) => v === null ? undefined : v));

    const jsonString = JSON.stringify(cleanObj, null, 2);
    setJsonResult(jsonString);

    // Create prompt text
    const promptText = `Create ${formData.digitalProduct} with the following specifications:\n\n${jsonString}`;
    setPrompt(promptText);

    // Generate text format prompt
    const textFormatPrompt = generateTextPrompt(formData);
    setTextPrompt(textFormatPrompt);
    
    toast({
      title: "Prompt Generated!",
      description: "Prompt berhasil dibuat dalam format JSON dan Text",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }, [formData, toast]);

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Berhasil Dicopy!",
      description: "Prompt telah disalin ke clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

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
                    AI Image Prompt Generator
                  </Badge>
                  <Heading 
                    color={textColor}
                    fontSize={{ base: "3xl", md: "5xl" }}
                    fontWeight="900"
                    bgGradient="linear(to-r, teal.500, blue.500, purple.500)"
                    bgClip="text"
                    lineHeight="shorter"
                  >
                    Fantasy Prompt Builder
                  </Heading>
                  <Text 
                    color={mutedColor} 
                    fontSize={{ base: "lg", md: "xl" }}
                    maxW="2xl"
                    lineHeight="tall"
                  >
                    Buat prompt AI Fantasy untuk image generation dengan form yang sudah disiapkan
                  </Text>
                </VStack>

                {/* Navigation Buttons */}
                <Box
                  display="flex"
                  gap={4}
                  flexWrap="wrap"
                  justify="center"
                  w="full"
                >
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
              {/* Main Form Card */}
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
                    {/* Header Controls */}
                    <Box>
                      <HStack justify="space-between" mb={4}>
                        <HStack>
                          <Icon as={FiTarget} color="red.500" fontSize="20" />
                          <Heading size="md" color={textColor}>
                            Controls
                          </Heading>
                        </HStack>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="solid"
                          onClick={resetAll}
                          leftIcon={<Icon as={FiRefreshCw} />}
                          bg="red.500"
                          color="white"
                          _hover={{ bg: "red.600" }}
                        >
                          RESET ALL
                        </Button>
                      </HStack>

                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold">Mode</FormLabel>
                            <Select
                              value={formData.mode}
                              onChange={(e) => updateFormData('mode', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                            >
                              {DROPDOWN_OPTIONS.mode.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="bold">Preset</FormLabel>
                            <Select
                              value={formData.preset}
                              onChange={(e) => updateFormData('preset', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                            >
                              {DROPDOWN_OPTIONS.preset.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    {/* COMPOSITION Section */}
                    <Box>
                      <HStack mb={4}>
                        <Icon as={FiLayers} color="blue.500" fontSize="20" />
                        <Heading size="md" color={textColor}>
                          COMPOSITION
                        </Heading>
                      </HStack>

                      <VStack spacing={4} align="stretch">
                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Digital product</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.digitalProduct}
                              onChange={(e) => updateFormData('digitalProduct', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.digitalProduct.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Creature</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.creature}
                              onChange={(e) => updateFormData('creature', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.creature.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Creature details</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.creatureDetails}
                              onChange={(e) => updateFormData('creatureDetails', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.creatureDetails.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Background</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.background}
                              onChange={(e) => updateFormData('background', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.background.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Mood/Vibe/Atmosphere</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.moodVibeAtmosphere}
                              onChange={(e) => updateFormData('moodVibeAtmosphere', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.moodVibeAtmosphere.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">CUSTOM CREATURE</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--type in your creature--"
                              value={formData.customCreature}
                              onChange={(e) => updateFormData('customCreature', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">CUSTOM DETAILS</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--type in your custom details--"
                              value={formData.customDetails}
                              onChange={(e) => updateFormData('customDetails', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* STYLE Section */}
                    <Box>
                      <HStack mb={4}>
                        <Icon as={FiLayers} color="purple.500" fontSize="20" />
                        <Heading size="md" color={textColor}>
                          STYLE
                        </Heading>
                      </HStack>

                      <VStack spacing={4} align="stretch">
                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Color palette</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.colorPalette}
                              onChange={(e) => updateFormData('colorPalette', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.colorPalette.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Color preset</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.colorPreset}
                              onChange={(e) => updateFormData('colorPreset', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.colorPreset.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">CUSTOM COLORS</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--type in your desired colors--"
                              value={formData.customColors}
                              onChange={(e) => updateFormData('customColors', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Basic style</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.basicStyle}
                              onChange={(e) => updateFormData('basicStyle', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.basicStyle.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Art style</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.artStyle}
                              onChange={(e) => updateFormData('artStyle', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.artStyle.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Style details</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.styleDetails}
                              onChange={(e) => updateFormData('styleDetails', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.styleDetails.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">CUSTOM STYLE OR DETAILS</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--type in your style or details--"
                              value={formData.customStyleOrDetails}
                              onChange={(e) => updateFormData('customStyleOrDetails', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* PARAMETERS Section */}
                    <Box>
                      <HStack mb={4}>
                        <Icon as={FiLayers} color="green.500" fontSize="20" />
                        <Heading size="md" color={textColor}>
                          PARAMETERS
                        </Heading>
                      </HStack>

                      <VStack spacing={4} align="stretch">
                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Midjourney version</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.midjourneyVersion}
                              onChange={(e) => updateFormData('midjourneyVersion', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.midjourneyVersion.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Stylize value and other</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.stylizeValue}
                              onChange={(e) => updateFormData('stylizeValue', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.stylizeValue.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Aspect ratio</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.aspectRatio}
                              onChange={(e) => updateFormData('aspectRatio', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.aspectRatio.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">IMAGE REF. IMAGE</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--Paste the link to the generic reference image--"
                              value={formData.imageRefImage}
                              onChange={(e) => updateFormData('imageRefImage', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">CHARACTER REF. IMAGE</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--Paste the link to the character reference image--"
                              value={formData.characterRefImage}
                              onChange={(e) => updateFormData('characterRefImage', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">STYLE REF. IMAGE</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              placeholder="--Paste the link to the style reference image--"
                              value={formData.styleRefImage}
                              onChange={(e) => updateFormData('styleRefImage', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            />
                          </GridItem>
                        </Grid>

                        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={4} alignItems="end">
                          <GridItem>
                            <Text fontSize="sm" fontWeight="bold">Parameters to exclude</Text>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={formData.parametersToExclude}
                              onChange={(e) => updateFormData('parametersToExclude', e.target.value)}
                              bg={inputBg}
                              borderRadius="lg"
                              size="sm"
                            >
                              {DROPDOWN_OPTIONS.parametersToExclude.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>
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
                      leftIcon={<Icon as={FiZap} />}
                      borderRadius="xl"
                      fontSize="lg"
                      fontWeight="bold"
                      transition="all 0.3s ease"
                      w="full"
                    >
                      Generate Prompt
                    </Button>
                  </VStack>
                </Box>
              </Box>

              {/* Result Card */}
              {(prompt || textPrompt) && (
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
                            Generated Prompt
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
                      
                      {/* Format Selection */}
                      <HStack spacing={2}>
                        <Text fontSize="sm" color={mutedColor}>Format:</Text>
                        <Button
                          size="xs"
                          variant={outputFormat === "text" ? "solid" : "ghost"}
                          colorScheme="teal"
                          onClick={() => setOutputFormat("text")}
                        >
                          Text
                        </Button>
                        <Button
                          size="xs"
                          variant={outputFormat === "json" ? "solid" : "ghost"}
                          colorScheme="blue"
                          onClick={() => setOutputFormat("json")}
                        >
                          JSON
                        </Button>
                        <Button
                          size="xs"
                          variant={outputFormat === "both" ? "solid" : "ghost"}
                          colorScheme="purple"
                          onClick={() => setOutputFormat("both")}
                        >
                          Both
                        </Button>
                      </HStack>

                      {/* Text Format Display */}
                      {(outputFormat === "text" || outputFormat === "both") && textPrompt && (
                        <Box
                          bg="gray.900"
                          p={4}
                          borderRadius="xl"
                          maxH="250px"
                          overflowY="auto"
                          mb={outputFormat === "both" ? 4 : 0}
                        >
                          <HStack mb={2}>
                            <Badge colorScheme="teal" size="sm">Text Format</Badge>
                          </HStack>
                          <Code
                            colorScheme="teal"
                            fontSize="sm"
                            whiteSpace="pre-wrap"
                            color="teal.300"
                            bg="transparent"
                            p={0}
                            display="block"
                            lineHeight="tall"
                          >
                            {textPrompt}
                          </Code>
                        </Box>
                      )}

                      {/* JSON Format Display */}
                      {(outputFormat === "json" || outputFormat === "both") && prompt && (
                        <Box
                          bg="gray.900"
                          p={4}
                          borderRadius="xl"
                          maxH="250px"
                          overflowY="auto"
                        >
                          {outputFormat === "both" && (
                            <HStack mb={2}>
                              <Badge colorScheme="blue" size="sm">JSON Format</Badge>
                            </HStack>
                          )}
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
                      )}
                    </VStack>
                  </Box>
                </Box>
              )}
            </Flex>
          </VStack>
        </ScaleFade>
      </Container>
    </Box>
  );
}