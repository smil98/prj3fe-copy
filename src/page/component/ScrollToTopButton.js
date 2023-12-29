import { Box, Fade, IconButton, useDisclosure } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

const ScrollToTopButton = () => {
  const { isOpen, onToggle } = useDisclosure();

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Adjust the threshold as needed
    if (scrollY > window.innerHeight * 0.4 && !isOpen) {
      onToggle();
    } else if (scrollY <= window.innerHeight * 0.4 && isOpen) {
      onToggle();
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <Fade in={isOpen}>
      <Box position="fixed" bottom="10" right="10" zIndex="1000">
        <IconButton
          icon={<ArrowUpIcon />}
          aria-label="Scroll to Top"
          size="md"
          colorScheme="purple"
          onClick={handleScrollTop}
        />
      </Box>
    </Fade>
  );
};

export default ScrollToTopButton;
