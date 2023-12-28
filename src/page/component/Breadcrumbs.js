import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export const Breadcrumbs = ({ pathSegments }) => {
  // const location = useLocation();
  // const pathSegments = location.pathname
  //   .split("/")
  //   .filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink to="/">
          <FontAwesomeIcon icon={faHome} />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink to={`/${pathSegments.slice(0, index + 1).join("/")}`}>
            {segment}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
